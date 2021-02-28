const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
/* Ensure any requests prefixed with /static will serve our "client/static" directory */
app.use("/client", express.static(path.resolve(__dirname, "client", "views")));


/* Redirect all routes to our (soon to exist) "index.html" file */
app.get("/*", (req, res) => {
    res.sendFile(path.resolve("client/views", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));