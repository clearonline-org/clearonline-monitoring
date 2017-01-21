/**
* @Author: mars
* @Date:   2017-01-17T00:19:37-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-20T23:42:19-05:00
*/

'use strict';

// START helper
function urlToDamin(url) {
	url = url || '';
	let domain = url.trim().split('http://');
	if (domain.length < 2) {
		domain = url.split('https://');
	}
	return (domain[1] || '').split('/')[0];
}
// END helper



console.log(urlToDamin);


const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();
console.log(api);

const SiteMonitoring = require('site-monitoring');
let debug = false;
console.log(SiteMonitoring);
let siteMonitoring = new SiteMonitoring(debug);
console.log(siteMonitoring);


module.exports = api;

api.registerAuthorizer('clearonlineMonitoring', {
	lambdaName: 'clearonlineMonitoring',
	lambdaVersion: true
});

api.get('/', function () {
	let title = 'Clearonline Monitoring', description = 'Find out where in the world you are sending your info!';
	return { title, description };
});

/**
 * <host>/end-poit/find-location?url=<url>
 * @param request.queryString.url
 * must be encoded
 * must start with http:// or https://
 */
api.get('/find-location', request => {
	let domainName = urlToDamin(request.queryString.url);

	return siteMonitoring.locateByDomain(domainName)
	.then(result => {
			// { origin, destination }
	    // origin = { region_code, latitude, longitude }
	    // destination = [ { region_code, latitude, longitude } ]
			return result.destination[0];
	});
}, { customAuthorizer: 'clearonlineMonitoring' });

/**
 * find all locations but do not log the request
 */
api.get('/analyse', request => {

	let sourceIp = request.context.sourceIp,
			country = request.headers['CloudFront-Viewer-Country'];
	console.log('country of origin', sourceIp, country);

	let domainName = urlToDamin(request.queryString.url);
	return siteMonitoring.locateIp(sourceIp)
	.then(origin => {
		// locateByDomain set origin to me
		// so i will change that to sender of the request instead
		return siteMonitoring.locateByDomain(domainName)
		.then(result => {
			result = Object.assign(result, { origin });
			return result;
		});

	});

}, { customAuthorizer: 'clearonlineMonitoring' });
/**
 * find all locations and log the request in dynamo-db
 */
api.get('/monitor', request => {

	let domainName = urlToDamin(request.queryString.url);

	return siteMonitoring.locateByDomain(domainName)
	.then(result => {
			// @TODO log to dynamo-db
			return result;
	});

}, { customAuthorizer: 'clearonlineMonitoring' });
