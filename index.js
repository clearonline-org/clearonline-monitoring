/**
* @Author: mars
* @Date:   2017-01-17T00:19:37-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-17T02:31:33-05:00
*/


// START helper
function urlToDamin(url) {
	'use strict';
	url = url || '';
	let domain = url.trim().split('http://');
	if (domain.length < 2) {
		domain = url.split('https://');
	}
	return domain[1];
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
	'use strict';
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
	'use strict';
	let domainName = urlToDamin(request.queryString.url);

	// return siteMonitoring.locateByDomain(domainName)
	// .then(result => {
	// 		// { origin, destination }
	//     // origin = { region_code, latitude, longitude }
	//     // destination = [ { region_code, latitude, longitude } ]
	// 		return result.destination[0];
	// });
	return domainName;
}, { customAuthorizer: 'clearonlineMonitoring' });

/**
 * find all locations but do not log the request
 */
api.get('/analyse', request => {
	'use strict';
	return 'OK for ' + request.context.authorizerPrincipalId;
}, { customAuthorizer: 'clearonlineMonitoring' });
/**
 * find all locations and log the request in dynamo-db
 */
api.get('/monitor', request => {
	'use strict';
	return 'OK for ' + request.context.authorizerPrincipalId;
}, { customAuthorizer: 'clearonlineMonitoring' });
