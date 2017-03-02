const WeatherApp = {
  init: () => {
    $('#submit-weather-search').click(() => {
        $('.spinner').removeClass('hidden');
    });

    $('#submit-weather-search').keypress((event) => {
        let key = event.which || event.keyCode;
        if (key === 13) {
            $('.spinner').removeClass('hidden');
        }
    });

    $(document).ready(() => {
        $('.spinner').addClass('hidden');
    });

    $('input').focus(() => {
        $('.search-error').remove();
    });
  },
};

WeatherApp.init();