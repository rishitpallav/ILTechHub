const { Client } = require("@elastic/elasticsearch");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "OPENAI-API-KEY",
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

  console.log(body);
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

  console.log(body.hits.hits);
  res.json(body.hits.hits);
});

app.post("/loginStudent", async (req, res) => {
  console.log("Login student");
  console.log(req.body);
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

  console.log(body.hits.hits[0]._source);
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

  console.log(body.hits.hits);
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

  console.log(body.hits.hits);
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
    openai.apiKey = "OPENAI-API-KEY";
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

    console.log(completion.choices[0].message.content);

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getOpenAISportEventRecommendations", async (req, res) => {
  const { ipJson } = req.body;

  const apiKey = "OPENWEATHER-API-KEY";
  const responses = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${ipJson.latitude}&lon=${ipJson.longitude}&appid=${apiKey}`
  );
  weatherData = await responses.json();
  // console.log(weatherData.weather[0].main);

  const searchResponse = await searchEventsInCity(ipJson.city);

  // console.log("search Response", searchResponse.events_results);
  const response = await openAIEventRecommendation(searchResponse, weatherData);

  console.log(response);

  res.json({
    data: response,
  });
});

async function searchEventsInCity(city) {
  const url = new URL("https://serpapi.com/search");
  const params = new URLSearchParams({
    engine: "google_events",
    api_key: "SERP-API-KEY",
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

async function openAIEventRecommendation(searchResponse, weatherData) {
  try {
    openai.apiKey = "OPENAI-API-KEY";
    gptResponse = [];
    for (let event of searchResponse.events_results) {
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
            " on " +
            event.date +
            " with description: " +
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
      console.log(completion.choices[0].message.content, message);
      if (completion.choices[0].message.content.substring(0, 3) == "Yes") {
        gptResponse.push(event);
      }
    }

    resultArr = [];
    for (let event of gptResponse) {
      resultArr.push({
        title: event.title,
        address: event.address,
        date: event.date,
        description: event.description,
      });
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
