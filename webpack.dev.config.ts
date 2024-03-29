import path from 'path'
import {
  Configuration as WebpackConfiguration,
  HotModuleReplacementPlugin,
} from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import baseConfig from './webpack.common.config'
import merge from 'webpack-merge'

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const config: Configuration = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [new HotModuleReplacementPlugin()],
})

export default config
