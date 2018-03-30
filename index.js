/*
 * Copyright (C) 2018  Cas Eliëns
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let fs = require('fs');
let profile = JSON.parse(fs.readFileSync('profile.json', 'utf8'));
let parsed = {
    basalprofile: [],
    sensitivity: 0.00,
    ratio: 0.00,
    csf: 0.00,
    total: 0.00,
    unit: "mg/dL"
};

function convertToMmol(input) {
    return Math.round(parseInt(input) / 18.016 * 10) / 10;
}

function calculateDailyBasal(basalprofile) {
    let rates = basalprofile.length;
    let total = 0;


    for (let i = 0; i < rates; i++) {
        let start = basalprofile[i].minutes;
        let end = 1440;

        if (i < rates - 1) {
            end = basalprofile[i+1].minutes;
        }

        let duration = end - start;
        total += basalprofile[i].rate * 60 / duration;
    }
    return Math.round(total*1000)/1000;
}

parsed.basalprofile = profile.basalprofile;
parsed.unit = profile.out_units;


if (parsed.unit === "mg/dL") {
    parsed.sensitivity = profile.sens;
    parsed.csf = profile.csf;
} else {
    parsed.sensitivity = convertToMmol(profile.sens);
    parsed.csf = convertToMmol(profile.csf);
}

parsed.ratio = profile.carb_ratio;
parsed.total = calculateDailyBasal(parsed.basalprofile);

console.log(parsed);

console.log("Basal (u/h)");

for (let i in parsed.basalprofile) {
    let time = parsed.basalprofile[i].start.substr(0, 5);
    let rate = parsed.basalprofile[i].rate;

    console.log(time + "  :  " + rate);
}
console.log("total: " + parsed.total + " u");

console.log("\nSensitivity: " + parsed.sensitivity + " (" + parsed.unit + ")/u");
console.log("Carb Ratio: " + parsed.ratio + " g/u");
console.log("Carb Sensitivity Factor: " + parsed.csf + " (" + parsed.unit + ")/g");