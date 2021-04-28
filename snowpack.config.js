// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        src: { url: "/" }
    },
    devOptions: {
        // TODO-HIGH: raise an error when unsafe port is chosen
        port: 7000
    },
    env: {
        SNOWPACK_PUBLIC_SCRIPT: "body/index.js",
        SNOWPACK_PUBLIC_NAME: process.env.npm_package_name,
        SNOWPACK_PUBLIC_BUILD_DATE: new Date().toLocaleDateString()
    }
};
