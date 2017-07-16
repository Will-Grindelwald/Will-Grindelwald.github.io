#!/usr/bin/env node

var pangu = require('pangu'),
    fs = require("fs");

pangu.spacingFile(process.argv[2], function (err, data) {
    fs.writeFile(process.argv[2], data, function (err) {
        if (err) {
            return console.error(err);
        }
    });
});
