/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import View from "@ioc:Adonis/Core/View";

View.global("relativeTime", (date: string) => {
  return new Date(date).toLocaleString();
});
