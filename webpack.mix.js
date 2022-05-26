let mix = require('laravel-mix');

mix.setPublicPath('./')
    .sass('assets/sass/popup.scss', 'dist/css/popup.css')
    .options({
        processCssUrls: false
    });