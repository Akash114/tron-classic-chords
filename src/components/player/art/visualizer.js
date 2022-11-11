import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Selection from "./songselection";
import recorder from '../react-canvas-recorder';
import React, { useCallback } from 'react'
import RecordView from "./recorder";

export default class Visualizer extends React.Component {
  state = {
    visualizer: null,
    audioContext: null,
    canvas: null,
    width: "",
    height: "",
    fullscreen: false,
    file: null,
  };

  constructor(props) {
    super(props);
    this.selectorRef = React.createRef(null);
  }


  // RecordView = () => {

  //     return (
  //         <div>
  //         <ReactMediaRecorder
  //             {...this.stream}
  //             render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
  //             <div>
  //                 <p>{status}</p>
  //                 <button onClick={startRecording}>Start Recording</button>
  //                 <button onClick={stopRecording}>Stop Recording</button>
  //                 <video src={mediaBlobUrl} controls autoPlay loop />
  //             </div>
  //             )}
  //         />
  //         </div>
  //     );
  // }

  componentDidMount = () => {

    this.setState({ presets: butterchurnPresets.getPresets() });
    //get width of screen we will make this auto adjust later.
    const width = window.innerWidth;
    const height = window.innerHeight;

    //get state of canvas visualizer and audio context
    let { canvas, visualizer, audioContext } = this.state;
    // const ctx = canvas.getContext('2d');

    //get canvas
    canvas = document.getElementById("canvas");

    //set width and height of canvas
    canvas.width = 200;
    canvas.height = 300;

    //create a new audio context
    audioContext = new AudioContext();

    //create visualizer with butterchurn
    visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: width,
      height: height
    });

    //intialize with default values
    this.visualizerIntializer(visualizer, audioContext, canvas, width, height);
    this.resize();
    this.stream = canvas.captureStream();

  };


  startRecording = () => {
    recorder.createStream(this.selectorRef.current);
    recorder.start();
  }

  stopRecording = () => {
    recorder.stop();
    const file = recorder.save();
    this.state.file = URL.createObjectURL(file);
    alert(file);

    const myFile_ = new File([file], "demo.mp4", { type: "video/webm" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.setAttribute("download", `FileName.mp4`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Do something with the file
  }

  resize = () => {
    let { canvas, visualizer, width, height, fullscreen } = this.state;

    //get width height
    let newwidth = 300;
    let newheight = 200;

    //compare size
    const total = newwidth + newheight;
    const oldTotal = width + height;
    //if not equal resize
    if (total !== oldTotal) {
      if (!fullscreen) {
        canvas = document.getElementById("canvas");
        console.log(canvas);
        //set width and height of canvas
        canvas.width = newwidth;
        canvas.height = newheight;
        //resize visualizer
        if (visualizer) {
          visualizer.setRendererSize(newwidth, newheight);
        }
        this.setState({
          width: newwidth,
          height: newheight
        });
      }
    }
  };
  visualizerIntializer = async (
    visualizer,
    audioContext,
    canvas,
    width,
    height
  ) => {
    visualizer.setRendererSize(width, height);
    this.setState({
      visualizer,
      audioContext,
      canvas,
      width,
      height
    });
    this.renderFrames();
    await setTimeout(() => { }, 5000);

    this.randomPresets(visualizer);
  };
  renderFrames = () => {
    let { visualizer } = this.state;
    if (visualizer) {
      visualizer.render();
    }
    setTimeout(() => {
      this.renderFrames(visualizer);
      this.resize();
    }, 1000 / 120);
  };
  randomPresets = (visualizer) => {
    let { presets } = this.state;
    let tempPresets = presets;

    console.log(Object.keys(presets).length);

    if (Object.keys(tempPresets).length === 0) {
      tempPresets = butterchurnPresets.getPresets();
    }
    let randomPreset = this.randomProperty(tempPresets);
    if (visualizer) {
      visualizer.loadPreset(tempPresets[randomPreset], 2); // 2nd argument is the number of seconds to blend presets
      delete tempPresets[randomPreset];
      this.setState({
        presets: tempPresets
      });
    }
    setTimeout(() => {
      return this.randomPresets(visualizer);
    }, 50000);
  };
  randomProperty = (obj) => {
    const key = Object.keys(obj);
    return key[Math.floor(Math.random() * key.length)];
  };

  render() {

    // const recordV = this.state.canvas?  <RecordView canvasA={this.state.canvas} /> : '';
    return (
      <>
        <div style={{ display: 'none' }}>

          {this.state.visualizer && this.state.audioContext ? (
            <Selection
              Visualizer={this.state.visualizer}
              audioContext={this.state.audioContext}
            />
          ) : null}


          <canvas id="canvas" ref={this.selectorRef} />
          <video src={this.file} controls />

        </div>
        <button onClick={this.startRecording}>Start Recording</button>
        <button onClick={this.stopRecording}>Stop Recording</button>
        {/* {recordV} */}
      </>
    );

  }
}