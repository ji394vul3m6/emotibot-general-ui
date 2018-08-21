export default {
  nodeType2Tabs() {
    return {
      entry: ['triggerTab', 'edgeTab'],
      dialogue: ['settingTab', 'edgeTab'],
    };
  },
  getEntityListMap() {
    const commonEntityOptions = [
      'time', 'city', 'landmark', 'money', 'time_period',
      'phone_call', 'adjust_light', 'adjust_volume', 'movie_name', 'song_name',
      'star_name', 'teleplay_name', 'album_name', 'number',
    ];
    const taskEntityOptions = [
      'fromPlace', 'toPlace', 'departDate', 'arriveDate', 'returnDate',
    ];
    const hotelEntityOptions = [
      'City', 'CheckinDate', 'CheckoutDate', 'LandMark', 'HotelName',
      'Star', 'Price',
    ];
    return {
      common_parser: commonEntityOptions,
      task_parser: taskEntityOptions,
      hotel_parser: hotelEntityOptions,
    };
  },
  getEntityModuleOptionsMap() {
    const entityListMap = this.getEntityListMap();
    return {
      none: [],
      common_parser: entityListMap.common_parser.map(option => ({
        // 'time_module', 'city_module', 'landmark_module', 'money_module', 'time_period_module',
        text: option,
        value: `${option}_module`,
      })),
      task_parser: entityListMap.task_parser.map((option) => {
        // from_place,to_place,depart_date,arrive_date,return_date
        const snakeCase = option.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();
        return {
          text: option,
          value: snakeCase,
        };
      }),
      hotel_parser: entityListMap.hotel_parser.map(option => ({
        // City,CheckinDate,CheckoutDate,LandMark,HotelName,Star,Price
        text: option,
        value: option,
      })),
    };
  },
};
