/**
* @Author: mars
* @Date:   2017-01-17T01:12:39-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-17T22:18:45-05:00
*/
'use strict';
const SiteMonitoring = require('site-monitoring');

let debug = true;
let siteMonitoring = new SiteMonitoring(debug);

siteMonitoring.locateByDomain('facebook.com')
.then(result => {
    // result = { origin, destination }
    // origin = { region_code, latitude, longitude }
    // destination = [ { region_code, latitude, longitude } ]
    console.log(result);
    console.log(result.destination[0]);
});
