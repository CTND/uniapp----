parallel: require('os').cpus().length > 1
configureWebpack: {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true, // 生产环境移除console
                        drop_debugger: true // 生产环境移除debugger
                    },
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false
                    }
                }
            })
        ]
    },
    plugins: [...]
}