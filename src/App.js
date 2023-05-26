import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkFom/ImageLinkFom";
import Rank from "./components/Rank/Rank";
import Particle from "./components/Particle/Particle";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const returnClarifyRequestOptions = (imageurl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "0d41d54936354948b3215486b8984cdc";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "siddhantnigam";
  const APP_ID = "test";
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  const IMAGE_URL = imageurl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
    };
  }

  calculateFaceLocation = (res) => {
    const clarifaiFace =
      res.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(clarifaiFace);
    // return {
    //   leftCol: clarifaiFace.left_col * width;
    //   topRow: clarifaiFace.top_row * height;

    // }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    console.log("click");
    this.setState({ imageUrl: this.state.input });

    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      returnClarifyRequestOptions(this.state.input)
    )
      .then((response) => response.json())
      .then((res) => this.calculateFaceLocation(res))
      .catch((err) => console.log(err));
    // .then((result) => console.log(result))
    // .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div className="App">
        <Particle className="Particless" />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
