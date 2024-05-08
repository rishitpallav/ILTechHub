const { Client } = require("@elastic/elasticsearch");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "OPENAI_API_KEY",
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "elasticroot",
  },
});

insertData = async () => {
  await client.index({
    index: "iitblog",
    body: {
      title: "IIT Blog 3",
      content: "This is a third blog post",
    },
  });

  // console.log(body);
};

app.get("/insert", async (req, res) => {
  await insertData();
  res.send("Data inserted");
});

app.get("/getData", async (req, res) => {
  const body = await client.search({
    index: "post",
    query: {
      match: {
        title: "Exercise",
      },
    },
  });

  // console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.post("/loginStudent", async (req, res) => {
  console.log("Login student");
  // console.log(req.body);
  const { username, password } = req.body;

  const body = await client.search({
    index: "student",
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                username,
              },
            },
            {
              match: {
                password,
              },
            },
          ],
        },
      },
    },
  });

  // console.log(body.hits.hits[0]._source);
  if (body.hits.hits.length > 0) {
    res.status(200).json(body.hits.hits[0]._source);
  } else {
    res.status(404).json("User not found");
  }
});

app.get("/fetchAllReplies", async (req, res) => {
  const body = await client.search({
    index: "reply",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  // console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllPosts", async (req, res) => {
  const body = await client.search({
    index: "post",
    size: 1000,
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log("In Node Post");

  // console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllStudents", async (req, res) => {
  const body = await client.search({
    index: "student",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllAdministrators", async (req, res) => {
  const body = await client.search({
    index: "administrator",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllModerators", async (req, res) => {
  const body = await client.search({
    index: "moderator",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllFaculties", async (req, res) => {
  const body = await client.search({
    index: "faculty",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.get("/fetchAllStaffs", async (req, res) => {
  const body = await client.search({
    index: "staff",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.post("/addReply", async (req, res) => {
  const { id, content, author, active, post } = req.body;

  await client.index({
    index: "reply",
    body: {
      id,
      content,
      author,
      date: new Date().toISOString(),
      active,
      post,
    },
  });

  res.send("Reply added");
});

app.post("/addPost", async (req, res) => {
  const { id, title, content, user, topic, active } = req.body;

  console.log(req.body);
  await client.index({
    index: "post",
    body: {
      id,
      title,
      content,
      user,
      date: new Date().toISOString(),
      topic,
      active,
    },
  });

  emailSubscribed(topic, title, user, content);

  res.send("Post added");
});

app.post("/searchPosts", async (req, res) => {
  const { title } = req.body;
  console.log(req.body);

  const body = await client.search({
    index: "post",
    body: {
      query: {
        match: {
          title,
        },
      },
    },
  });

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.post("/subscribe", async (req) => {
  const { email, topic } = req.body;
  console.log(email, topic);

  try {
    const existingTopic = await client.get({
      index: "subscriptions",
      id: topic,
    });

    if (existingTopic) {
      await client.update({
        index: "subscriptions",
        id: topic,
        body: {
          doc: {
            emails: [...existingTopic._source.emails, email],
          },
        },
      });
    } else {
      await client.index({
        index: "subscriptions",
        id: topic,
        body: {
          emails: [email],
        },
      });
    }
  } catch (error) {
    if (error.body.found == false) {
      await client.index({
        index: "subscriptions",
        id: topic,
        body: {
          emails: [email],
        },
      });
    } else {
      console.log(error);
    }
  }
});

async function emailSubscribed(topic, title, user, content) {
  const users = await client.get({
    index: "subscriptions",
    id: topic,
  });

  emails = users._source.emails;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rishitpallav6@gmail.com",
      pass: "obpabqxlladiihgk",
    },
  });

  const htmlTemplate = `
  <style>
    .post-summary {
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding: 15px;
    }

    .post-summary h1 {
      font-size: 1.5em;
      margin-bottom: 5px;
    }

    .post-summary p {
      font-size: 0.9em;
      margin-bottom: 10px;
    }

    .post-summary a {
      color: #333;
      text-decoration: none;
    }

    .post-summary a:hover {
      text-decoration: underline;
    }
  </style>
  <div class="post-summary">
    <h1>Check out the new post on "${topic}"</h1>
    <p>By ${user.toUpperCase()}</p>
    <h4>${title}</h4>
    <p>${content.substring(0, 100)}...</p>
    <a href="http://localhost:3000/">Read more at IITBlog</a>
  </div>`;

  for (let email of emails) {
    var mailOptions = {
      from: "rishitpallav6@gmail.com",
      to: email,
      subject: "New IITBlog Post on " + topic,
      html: htmlTemplate,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

app.post("/generateReply", async (req, res) => {
  const { title, content } = req.body;

  // res.json({
  //   reply: "Reply generated successfully",
  // });

  try {
    openai.apiKey = "OPENAI_API_KEY";
    const message = [
      { role: "system", content: "You are a post replying emotional bot." },
      {
        role: "user",
        content:
          "Generate a 10 to 15 word reply for the following post: " +
          title +
          " " +
          content,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: message,
      max_tokens: 30,
      temperature: 0.5,
      top_p: 1,
    });

    // console.log(completion.choices[0].message.content);

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getOpenAISportEventRecommendations", async (req, res) => {
  const { ipJson } = req.body;

  const apiKey = "OPENWEATHERMAP_API_KEY";
  const responses = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${ipJson.latitude}&lon=${ipJson.longitude}&appid=${apiKey}`
  );
  weatherData = await responses.json();
  // console.log(weatherData.weather[0].main);

  const searchMusicalEventsResponse = await searchEventsInCity(
    "Musical Concerts",
    ipJson.latitude,
    ipJson.longitude
  );
  const musicResponse = await openAIEventRecommendation(
    searchMusicalEventsResponse,
    weatherData
  );

  const searchRestaurantsResponse = await searchEventsInCity(
    "Restaurants",
    ipJson.latitude,
    ipJson.longitude
  );
  const restaurantResponse = await openAIRestaurantRecommendation(
    searchRestaurantsResponse,
    weatherData
  );

  const searchSportEventsResponse = await searchSportEventsInCity(ipJson.city);

  // console.log(searchSportEventsResponse.events_results[0].date);

  const sportResponse = await openAISportEventsRecommendation(
    searchSportEventsResponse,
    weatherData
  );

  // console.log(sportResponse);
  // console.log("music response", musicResponse);
  // console.log("restaurant response", restaurantResponse);

  // response = restaurantResponse;

  const response = musicResponse
    .concat(restaurantResponse)
    .concat(sportResponse);

  // console.log("search Response", searchResponse.events_results);

  // console.log(response);

  res.json({
    data: response,
    // data: [],
  });
});

// async function searchMusicalEventsInCity(city) {
//   const url = new URL("https://serpapi.com/search");
//   const params = new URLSearchParams({
//     engine: "google_events",
//     api_key: "",
//     q: `musical concert events in ${city}`,
//     google_domain: "google.com",
//     location: city,
//     num: 80,
//   });

//   url.search = params.toString();

//   try {
//     const response = await fetch(url.toString());
//     if (!response.ok) {
//       throw new Error("Failed to fetch search results");
//     }
//     const searchData = await response.json();
//     return searchData;
//   } catch (error) {
//     console.error("Error searching events:", error);
//     throw error;
//   }
// }

async function searchSportEventsInCity(city) {
  const url = new URL("https://serpapi.com/search");
  const params = new URLSearchParams({
    engine: "google_events",
    api_key: "SERPAPI_KEY",
    q: `sport events in ${city}`,
    google_domain: "google.com",
    location: city,
    num: 80,
  });

  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const searchData = await response.json();
    return searchData;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
}

async function openAISportEventsRecommendation(searchResponse, weatherData) {
  try {
    openai.apiKey = "OPENAI_API_KEY";
    gptResponse = [];
    let count = 0;
    let addedAddresses = [];
    let difference = 0.0;
    for (let event of searchResponse.events_results) {
      // console.log(addedAddresses);
      if (addedAddresses.includes(event.address[0])) {
        difference += 0.001;
      }
      message = [
        {
          role: "system",
          content:
            "You are a weather thoughtful event recommending bot recommending me 5 events only saying Yes or No.",
        },
        {
          role: "user",
          content:
            "Would you recommend me this sport event: " +
            event.title +
            " at " +
            event.address +
            " with description: " +
            event.description +
            " ? based on the weather: " +
            weatherData.weather[0].main +
            " return the only one word: Yes or No.",
        },
      ];
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: message,
        max_tokens: 30,
        temperature: 0.5,
        top_p: 1,
      });
      // console.log(completion.choices[0].message.content, message);
      if (completion.choices[0].message.content.substring(0, 3) == "Yes") {
        // console.log(event);
        addedAddresses.push(event.address[0]);
        let coordinates = await getCoordinates(event.address);
        coordinates.latitude += difference;
        resultArr.push({
          type: "Sport",
          title: event.title,
          address: event.address,
          date: event.date.when,
          operating_hours: event.link,
          description: event.description,
          gps_coordinates: coordinates,
        });
        count++;
      }
      if (count == 3) {
        break;
      }
    }

    resultArr = [];
    for (let event of gptResponse) {
    }

    while (count < 3) {
      for (let event of searchResponse.events_results) {
        addedAddresses.push(event.address[0]);
        let coordinates = await getCoordinates(event.address);
        coordinates.latitude += difference;
        resultArr.push({
          type: "Sport",
          title: event.title,
          address: event.address,
          date: event.date.when,
          operating_hours: event.link,
          description: event.description,
          gps_coordinates: coordinates,
        });
        count++;
        if (count == 3) {
          break;
        }
      }
    }

    return resultArr;
  } catch (error) {
    console.log(error);
  }
}

async function getCoordinates(address) {
  // fetching from google geocode api
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  const params = new URLSearchParams({
    address,
    key: "GEOCODER_API_KEY",
  });

  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const searchData = await response.json();
    // console.log(searchData);
    const gps_coordinates = {
      latitude: searchData.results[0].geometry.location.lat,
      longitude: searchData.results[0].geometry.location.lng,
    };
    return gps_coordinates;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
}

async function searchEventsInCity(type, latitude, longitude) {
  const url = new URL("https://serpapi.com/search");
  const params = new URLSearchParams({
    engine: "google_maps",
    api_key: "SERPAPI_KEY",
    q: type,
    type: "search",
    ll: `@${latitude},${longitude},15z`,
    num: 80,
  });

  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const searchData = await response.json();
    // console.log(searchData.local_results);
    return searchData.local_results;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
}

async function openAIEventRecommendation(searchResponse, weatherData) {
  try {
    // console.log("HERE");
    openai.apiKey = "OPENAI_API_KEY";
    gptResponse = [];
    let count = 0;
    for (let event of searchResponse) {
      message = [
        {
          role: "system",
          content:
            "You are a weather thoughtful event recommending bot recommending me 5 events only saying Yes or No.",
        },
        {
          role: "user",
          content:
            "Would you recommend me this event: " +
            event.title +
            " at " +
            event.address +
            " with description: " +
            event.description +
            " ? based on the weather: " +
            weatherData.weather[0].main +
            " return the only one word: Yes or No.",
        },
      ];
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: message,
        max_tokens: 30,
        temperature: 0.5,
        top_p: 1,
      });
      // console.log(completion.choices[0].message.content, message);
      if (completion.choices[0].message.content.substring(0, 3) == "Yes") {
        gptResponse.push(event);
        count++;
      }
      if (count == 3) {
        break;
      }
    }

    resultArr = [];
    for (let event of gptResponse) {
      let operatingHoursString = "";

      for (const day in event.operating_hours) {
        operatingHoursString += `${
          day.charAt(0).toUpperCase() + day.slice(1)
        }: ${event.operating_hours[day]}\n`;
      }

      if (operatingHoursString == "") {
        operatingHoursString =
          "Sunday: 7 AM-11 PM Monday: 7 AM-11 PM Tuesday: 7 AM-11 PM Wednesday: 7 AM-11 PM Thursday: 7 AM-11 PM Friday: 7 AM-11 PM Saturday: 7 AM-11 PM";
      }

      // console.log(event);
      resultArr.push({
        type: "Music",
        title: event.title,
        address: event.address,
        date: event.hours,
        operating_hours: operatingHoursString,
        description: event.description,
        gps_coordinates: event.gps_coordinates,
      });
    }

    while (count < 3) {
      for (let event of searchResponse) {
        let operatingHoursString = "";

        for (const day in event.operating_hours) {
          operatingHoursString += `${
            day.charAt(0).toUpperCase() + day.slice(1)
          }: ${event.operating_hours[day]}\n`;
        }

        if (operatingHoursString == "") {
          operatingHoursString =
            "Sunday: 7 AM-11 PM Monday: 7 AM-11 PM Tuesday: 7 AM-11 PM Wednesday: 7 AM-11 PM Thursday: 7 AM-11 PM Friday: 7 AM-11 PM Saturday: 7 AM-11 PM";
        }

        resultArr.push({
          type: "Music",
          title: event.title,
          address: event.address,
          date: event.hours,
          operating_hours: operatingHoursString,
          description: event.description,
          gps_coordinates: event.gps_coordinates,
        });
        count++;
        if (count == 3) {
          break;
        }
      }
    }

    return resultArr;
  } catch (error) {
    console.log(error);
  }
}

async function openAIRestaurantRecommendation(searchResponse, weatherData) {
  try {
    openai.apiKey = "OPENAI_API_KEY";
    gptResponse = [];
    let count = 0;
    for (let event of searchResponse) {
      message = [
        {
          role: "system",
          content:
            "You are a weather thoughtful event recommending bot recommending me 5 events only saying Yes or No.",
        },
        {
          role: "user",
          content:
            "Would you recommend me this restaurant: " +
            event.title +
            " at " +
            event.address +
            " with today's store timings " +
            event.hours +
            " right now the time is " +
            new Date().toLocaleTimeString() +
            " the restaurant description: " +
            event.description +
            " ? heavily based on the weather: " +
            weatherData.weather[0].main +
            " return the only one word: Yes or No.",
        },
      ];
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: message,
        max_tokens: 30,
        temperature: 0.5,
        top_p: 1,
      });
      // console.log(completion.choices[0].message.content, message);
      if (completion.choices[0].message.content.substring(0, 3) == "Yes") {
        gptResponse.push(event);
        count++;
      }
      if (count == 3) {
        break;
      }
    }

    resultArr = [];
    for (let event of gptResponse) {
      let operatingHoursString = "";

      for (const day in event.operating_hours) {
        operatingHoursString += `${
          day.charAt(0).toUpperCase() + day.slice(1)
        }: ${event.operating_hours[day]}\n`;
      }

      resultArr.push({
        type: "restaurant",
        title: event.title,
        address: event.address,
        date: event.hours,
        operating_hours: operatingHoursString,
        description: event.description,
        gps_coordinates: event.gps_coordinates,
      });
    }

    while (count < 3) {
      for (let event of searchResponse) {
        let operatingHoursString = "";

        for (const day in event.operating_hours) {
          operatingHoursString += `${
            day.charAt(0).toUpperCase() + day.slice(1)
          }: ${event.operating_hours[day]}\n`;
        }

        resultArr.push({
          type: "restaurant",
          title: event.title,
          address: event.address,
          date: event.hours,
          operating_hours: operatingHoursString,
          description: event.description,
          gps_coordinates: event.gps_coordinates,
        });
        count++;
        if (count == 3) {
          break;
        }
      }
    }

    return resultArr;
  } catch (error) {
    console.log(error);
  }
}

app.post("/unsubscribe", (req, res) => {
  const { email, topic } = req.body;
  console.log(email, topic);

  client.update({
    index: "subscriptions",
    id: topic,
    body: {
      script: {
        source: `ctx._source.emails.removeIf(email -> email == "${email}")`,
      },
    },
  });

  res.send("Unsubscribed successfully");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
