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

let validator = require('jsonschema').Validator;
let v = new validator();

let basalSettingSchema = {
    "id": "/BasalSetting",
    "type": "object",
    "properties": {
        "i": {"type": "number", "minimum": 0, "maximum": 47},
        "start": {"type": "string", "pattern": /[0-9]{2}:[0-9]{2}:[0-9]{2}/},
        "rate": {"type": "number"},
        "minutes": {"type": "integer", "minimum": 0, "maximum": 1410}
    },
    "required": ["i", "start", "rate", "minutes"]
};

let basalProfileSchema = {
    "id": "/BasalSchema",
    "type": "array",
    "items": {"$ref": "/BasalSetting"}
};

v.addSchema(basalSettingSchema);
v.addSchema(basalProfileSchema);

module.exports = v;