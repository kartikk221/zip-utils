# ZipCode
Below is a breakdown of the `ZipCode` component which represents each zip code datapoint in the Dataset map.

#### ZipDataset Properties
| Property  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `symbols` | `String[]`  | Symbol array that hold this zip code's values |
| `zip` | `String`  | The zip code identifier value |
| `latitude` | `Number`  | The latitude coordinate of this zip code |
| `longitude` | `Number`  | The longitude coordinate of this zip code |
| `country_code` | `String`  | The country code of this zip code |
| `city_name` | `String`  | The city name of this zip code |
| `state_name` | `String`  | The state name of this zip code |
| `state_code` | `String`  | The state code of this zip code |
| `county_name` | `String`  | The county name of this zip code |
| `county_code` | `String`  | The county code of this zip code |

**Note!** The above properties simply act as an opinionated structure for each zip code hence the actual accuracy of each property will depend entirely on the used dataset.