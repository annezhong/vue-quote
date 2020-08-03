'use strict'
const path = require("path");
const fs = require('fs')
module.exports = {
    getrelative: function (_url) {
        _url = _url || this.path;
        var __url = _url.replace(/^\//, '');
        var one = __url.split("/")[0];
        var two = __url.split("/")[1];
        if ((one == "manage" || one == "station") && !(/^[0-9]*$/.test(two) && two.length > 4)) { //非站点
            return "/" + one;
        } else {
            var l = __url.split("/").length;
            var ls = [];
            if (l > 2) {
                l = l - 2;
                for (var i = 0; i < l; i++) {
                    ls.push("..");
                }
                return ls.join("/");
            } else {
                return ".";
            }
        }
    },
    renderMap(modules) {
        //  console.log("modules", modules);
        modules = modules || [];
        var dir = path.join(this.app.config.baseDir, "backstage");
        var map = [];
        var mp = "";
        var relative = this.getrelative();
        for (var index in modules) {
            var name = modules[index];
            if (this.app.config.env == "local") {
                mp = path.join(dir, name, "eruit.json");
                if (fs.existsSync(mp)) {
                    let modulePkg = fs.readFileSync(mp, "utf-8");
                    let moduleconfig = {};
                    if (modulePkg) {
                        moduleconfig = JSON.parse(modulePkg);
                    }
                    let modulePort = moduleconfig.port;
                    let dev_modules = this.app.config.dev_modules;
                    if (!!dev_modules && dev_modules.indexOf(name) >= 0) { //用本地的开发代码
                        map.push({
                            name: name,
                            type: "js",
                            path: [`${this.app.config.admin_root_path}:${modulePort}/js/app.js`, `${this.app.config.admin_root_path}:${modulePort}/js/chunk-vendors.js`]
                        });
                    } else {
                        map.push({
                            name: name,
                            type: "css",
                            path: [`${relative}/public/dist/${name}/css/app.css`]
                        });
                        map.push({ //用编译后的代码
                            name: name,
                            type: "js",
                            path: [`${relative}/public/dist/${name}/js/app.js`, `${relative}/public/dist/${name}/js/chunk-vendors.js`]
                        });
                    }
                } else {
                    map.push({
                        name: name,
                        type: "css",
                        path: [`${relative}/public/dist/${name}/css/app.css`]
                    });
                    map.push({
                        name: name,
                        type: "js",
                        path: [`${relative}/public/dist/${name}/js/app.js`, `${relative}/public/dist/${name}/js/chunk-vendors.js`]
                    });
                }
            } else {
                map.push({
                    name: name,
                    type: "css",
                    path: [`${relative}/public/dist/${name}/css/app.css`]
                });
                map.push({
                    name: name,
                    type: "js",
                    path: [`${relative}/public/dist/${name}/js/app.js`, `${relative}/public/dist/${name}/js/chunk-vendors.js`]
                });
            }
        }
        return map;
    }
}