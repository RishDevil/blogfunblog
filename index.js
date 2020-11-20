const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const upload = require("./upload");
const Blog = require("./userModel");
const User = require("./userSign");
const { MONGOURI } = require("./config/keys");

const app = express();
///////////////middleware

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////////////////db

try {
  mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //mongodb+srv://rish:<password>@cluster0.kjvxf.mongodb.net/test
  console.log("conected....", __dirname);
} catch (error) {
  console.log(error);
}
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api/uploads", upload);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("bloggy/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "bloggy", "build", "index.html"));
  });
}
app.post("/blogcreate", async (req, res) => {
  Blog.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      res.status(200).send({ data: data });
    }
  });
});

app.get("/blog", async (req, res) => {
  console.log("blogggggggg");
  Blog.find((err, data) => {
    if (err) {
      res.status(400).send({ message: err });
    } else {
      console.log("sendinggg...");
      res.status(200).send({ data: data });
    }
  });
});
app.get("/blogD/:id", async (req, res) => {
  console.log("in detail");
  Blog.findById({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log("detail errr");
      res.status(400).send({ message: err });
    } else {
      console.log("sendinggg...");
      res.status(200).send({ data: data });
    }
  });
});

app.get("/api", (req, res) => {
  console.log("dirname ", __dirname);

  res.send({ data: "access" });
});
app.put("/blogupdate/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const blog = await Blog.findOne({ _id: id });
    if (blog) {
      (blog.title = req.body.title), (blog.sub_des = req.body.sub_des);
      (blog.place = req.body.place),
        (blog.country = req.body.country),
        (blog.des = req.body.des),
        (blog.image = req.body.image);

      const save = await blog.save();

      if (save) res.send({ data: save });
    }
  } catch (error) {
    res.send({ message: error });
  }
});
app.delete("/blogdelete/:id", async (req, res) => {
  try {
    const del = await Blog.findById(req.params.id);
    if (del) {
      await del.remove();

      res.send({ data: "Delete Blog" });
    }
  } catch (error) {
    res.send({ message: "error" });
  }
});

app.post("/signin", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      console.log(err, "errorrr");
      res.send({ message: "no user" });
    }
    if (data) {
      console.log(data, "daaaataa");
      if (data.password == req.body.password && data.admin == true) {
        console.log("logined");

        res.send({ data: { username: data.username, email: data.email } });
      } else {
        console.log("logined cancels");
        res.send({ message: "You are not authorised" });
      }
    } else {
      res.send({ message: "Register first" });
    }
  });
});

app.post("/register", async (req, res) => {
  console.log("enter");
  User.findOne({ username: req.body.username }, (err, data) => {
    if (data) {
      res.send({ message: "User  be unique" });
    } else {
      User.findOne({ email: req.body.email }, (err, data) => {
        if (data) {
          res.send({ message: "Email exits!" });
        } else {
          User.create(
            {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
            },
            (err, data) => {
              if (err) {
                console.log(err, "errr");
                res.send("error");
              } else {
                console.log(data, "reg");
                res.send({
                  data: { username: data.username, email: data.email },
                });
              }
            }
          );
        }
      });
    }
  });
});

app.listen(process.env.PORT || 2000, () => {
  console.log("listenning");
});
