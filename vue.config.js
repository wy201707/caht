const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    // devtool: 'source-map',
    configureWebpack: {
        // devtool
        devtool: 'source-map'
    },
    // devServer: {
    //   proxy: 'http://localhost:3001'
    // },

    //好家伙这个devServer根本没用啊？？？？

    lintOnSave: false, //关闭eslint检查,
    publicPath: './', //配置公共路径   0922也不知道其他的组件用到没有先改成可以用的
    // publicPath:'./vuegis/'
    /*     devServer: {
        //   // true 则热更新，false 则手动刷新，默认值为 true
        //   // inline: true,
        //   // development server port 8000
        port: 8001
    }, */
    /*    //0213配置axios（不起作用）
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3003',
                pathRewrite: { '^/api': '' },
                ws: true,
                changeOrigin: true
            }
        }
    },
 */
    /*     // 0215 这个编译器不认识
    proxyTable: {
        // 代理规则
        '/api': {
            // 配置的url请求名字开头
            target: 'http://localhost:3003', //'http://10.18.110.107',

            //target: 'http://10.18.110.107/api'
            // https请求需要该设置
            secure: false,
            // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，

            // 必须设置该项
            changeOrigin: true,
            pathRewrite: {
                '^/api': '' //这里理解成用 “/api”代替target里面的地址，后面组件中我们调接口是直接用api代替
                //比如我要调用 ‘http：、、40.00.100.100:1001:3000/user/info’  直接写成 ‘/api/user/info’}
            }
        }
    }, */
    devServer: {
        port: 8001, //这是前端地址 vue项目：前端页面打开地址
        proxy: {
            '/users': {
                target: 'http://localhost:3003/users', //要与后端地址一样
                ws: true,
                changeOrigin: true
                // pathRewrite: { '^/userApi': '/users' }
            }
        }
    },

    /*  dev: {
        // env: require('./.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // 代理规则
            '/api': {
                // 配置的url请求名字开头
                target: 'http://localhost:3003', //'http://10.18.110.107',

                //target: 'http://10.18.110.107/api'
                // https请求需要该设置
                secure: false,
                // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，

                // 必须设置该项
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' //这里理解成用 “/api”代替target里面的地址，后面组件中我们调接口是直接用api代替
                    //比如我要调用 ‘http：、、40.00.100.100:1001:3000/user/info’  直接写成 ‘/api/user/info’}
                }
            }
        },
        cssSourceMap: false
    }, */
    //webpack配置
    configureWebpack: {
        //关闭 webpack 的性能提示
        performance: {
            hints: false
        }

        //或者
        //警告 webpack 的性能提示
        /*  performance: {
        hints: 'warning',
        //入口起点的最大体积
        maxEntrypointSize: 50000000,
        //生成文件的最大体积
        maxAssetSize: 30000000,
        //只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    } */
    }
});
