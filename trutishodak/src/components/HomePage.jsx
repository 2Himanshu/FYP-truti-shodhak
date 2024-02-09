import React, { Component } from "react";
import img1 from "./images/img1.jpg";
import img2 from "./images/img2.jpg";
import SuggestionCard from "./SuggestionCard";
import Keyboard from "./Keyboard";
import { FaKeyboard } from "react-icons/fa";
import { RiMenuUnfoldLine } from "react-icons/ri";
import dictionary from "./virtualKeyboardDictionary";
import SideNav from "./SideNav";
import diffCalculator from "./diffCalculator";
import Firebase from "firebase";
import config from "./config";
import DiffMatchPatch from "diff-match-patch";
import { MdSpellcheck } from "react-icons/md";
import Assistant from "./Assistant";
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import ReactDiffViewer from 'react-diff-viewer'

class HomePage extends Component {
  // state = {
  //   imgHolder: img1,
  //   keyboard: true,
  //   corrections: [["Example", "Example"]],
  //   mistakes: 0,
  //   mistakesLength: 0,
  //   totalLength: 0,
  //   isLoading: false,
  //   t1: "",
  //   t2: "",
  // };
  database = null;
  constructor(props) {
    super(props);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.onEditTitle = this.onEditTitle.bind(this);
    this.toggleKeyboard = this.toggleKeyboard.bind(this);
    this.deleteSuggestionCard = this.deleteSuggestionCard.bind(this);
    this.checkSentence = this.checkSentence.bind(this);
    this.openAssistant = this.openAssistant.bind(this);
    this.addToDictionary = this.addToDictionary.bind(this);
    this.state=
      {
        imgHolder: img1,
        keyboard: true,
        corrections: [["Example", "Example"]],
        mistakes: 0,
        mistakesLength: 0,
        totalLength: 0,
        isLoading: false,
        t1: "",
        t2: "",
      };
  }

  // componentDidMount() {
  //   Firebase.initializeApp(config);
  //   this.database = Firebase.database();
  // }
  replaceContent(input, target, count) {
    // changes to be stored here.
    let result = document.getElementById("content").value;
    // const dmp = new DiffMatchPatch();
    // result = dmp.patch_apply(count, result);
    console.log(input)
    document.getElementById("content").value = input;
  }
  addToDictionary(id, sentence) {
    console.log("hello", id, sentence);
    this.database.ref("/sentences/").push(sentence, (err) => console.log(err));
    this.deleteSuggestionCard(id);
  }
  onEditTitle(e) {
    document.getElementsByTagName("title")[0].innerHTML = e.target.value;
  }
  toggleKeyboard() {
    if (this.state.keyboard) {
      document.getElementById("keyboard_holder").style.display = "none";
      document.getElementById("content").rows = 20;
    } else {
      document.getElementById("keyboard_holder").style.display = "block";
      document.getElementById("content").rows = 8;
    }
    this.setState({ keyboard: !this.state.keyboard });
  }

  highlightDifferences = (text1, text2) => {
    let highlightedText = '';
    const maxLength = Math.max(text1.length, text2.length);
  
    for (let i = 0; i < maxLength; i++) {
      if (text1[i] !== text2[i]) {
        highlightedText += `<mark>${text1.charAt(i) || ''}</mark>`;
      } else {
        highlightedText += text1.charAt(i) || '';
      }
    }
    return highlightedText;
  };
  
  // checkSentence() {
  //   this.setState({ isLoading: true });
  //   this.setState({ corrections: [] });
  //   let results = "";
  //   let sentence = document.getElementById("content").value;
  //   console.log(sentence)
  //   // // console.log(typeof sentence);
  //   // let corrections = [];
  //   let test = [];
  //   this.setState({ isLoading: true });
  //   // नमस्तेंे। मैं हो बोर रहा हूँ। ख़ुदा हाफ़ीज़।  ौन जाने? मजेंे करो।
  //   fetch("http://localhost:5000/suggest", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       input_sentence: sentence,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       results = res["output"];
  //       test = [sentence, results];
  //       const dmp = new DiffMatchPatch();
  //       const diff = dmp.patch_make(test[0], test[1]);
  //       console.log();
  //       // var diff1 = [diff[0]];
  //       // var test1 = dmp.patch_apply(diff1, test[0]);
  //       // var diff2 = [diff[1]];
  //       // test1 = dmp.patch_apply(diff2, test1);
  //       var changes = [];
  //       let mistakes = 0;
  //       for (let j = 0; j < diff.length; j++) {
  //         changes.push([
  //           test[0].substr(diff[j].start1, diff[j].length1),
  //           test[1].substr(diff[j].start2, diff[j].length2),
  //           [diff[j]],
  //         ]);
  //         mistakes += diff[j].length1;
  //       }
  //       this.setState(
  //         {
  //           corrections: changes,
  //           mistakes: changes.length,
  //           mistakesLength: mistakes,
  //           totalLength: sentence.length,
  //         },
  //         () => console.log(this.state)
  //       );
  //     })
  //     .then(() => {
  //       console.log("res", results);

  //       this.setState({ isLoading: false });
  //     });
  //   // console.log(results);
  // }

checkSentence() {
    this.setState({ isLoading: true });
    this.setState({ corrections: [] });
    let sentence = document.getElementById("content").value;
    this.setState({t1: sentence})
    axios.post("http://localhost:5000/suggest", {
        input_sentence: sentence
    })
    .then((response) => {
        let results = response.data.closest_words; // Assuming the response structure has closest_words key
        console.log(results,"this is console")
        // let test = [sentence, results];
        // const dmp = new DiffMatchPatch();
        // const diff = dmp.patch_make(test[0], test[1]);

        const changes = results;
        let mistakes = 0;
        // for (let j = 0; j < diff.length; j++) {
        //     changes.push([
        //         test[0].substr(diff[j].start1, diff[j].length1),
        //         test[1].substr(diff[j].start2, diff[j].length2),
        //         [diff[j]],
        //     ]);
        //     mistakes += diff[j].length1;
        // }
        this.setState({
            corrections: results,
            mistakes: changes.length,
            mistakesLength: mistakes,
            totalLength: sentence.length,
            t2: results[0][0]
        }, () => console.log(this.state));
        console.log(changes)
    })
    .catch((error) => {
        console.error("Error:", error);
    })
    .finally(() => {
        this.setState({ isLoading: false });
    });
}

  onChangeContent(e) {
    e.preventDefault();
    let temp = e.target.value;
    let ct = e.which || e.keyCode;
    temp += dictionary[ct];
    e.target.value = temp;
  }
  openSideNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  openAssistant() {
    document.getElementById("myAssistant").style.width = "120px";
  }
  deleteSuggestionCard(id, sentence, flag) {
    if (flag === 1) {
      this.database
        .ref("/sentences/")
        .push(sentence, (err) => console.log(err));
    }
    let temp = parseInt(id.replace("suggestion_", ""));
    let corrections = this.state.corrections;
    corrections.splice(temp, 1);
    this.setState({ corrections: corrections });
  }
  updateVal() {
    let val = document.getElementById("content").value;
    document.getElementById("words").innerHTML =
      val == "" ? "0 words" : val.split(" ").length + " words";
    document.getElementById("characters").innerHTML =
      val.length + " characters";
  }
  render() {
    return (
      <div className="container-fluid">
        <h3 id="title">Truti Shodhak</h3>
        <SideNav />
        <div className="row">
          <div className="col-sm-1">
            <br />
            <div
              id="sidenav_holder"
              style={{ width: "100px", whiteSpace: "nowrap" }}
            >
              <FaKeyboard
                onClick={this.toggleKeyboard}
                fill="rgb(83, 6, 226)"
                size="20px"
                title="Virtual Keyboard"
                style={{ cursor: "pointer" }}
                data-toggle="tooltip"
              />
              <span
                style={{
                  marginLeft: "8px",
                  borderLeft: "1px solid lightgray",
                }}
              ></span>
              <RiMenuUnfoldLine
                fill="grey"
                size="16px"
                title="Open Menu"
                data-toggle="tooltip2"
                onClick={this.openSideNav}
                style={{
                  margin: "0.4vw",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          <div className="col-sm-6" id="doc">
            <input
              type="text"
              className="form-control doc_title m-2"
              placeholder="Untitled Document"
              onBlur={(e) => this.onEditTitle(e)}
              id="doc_title"
            />{" "}
            <textarea
              rows="8"
              id="content"
              onKeyPress={(e) => this.onChangeContent(e)}
              onKeyDown={this.updateVal}
              onChange={this.updateVal}
              className="form-control content m-2 mt-5"
              placeholder="Type or paste (Ctrl+V) your text here."
            />
            <div id="keyboard_holder">
              <Keyboard />
            </div>
            <button
              className="btn btn-sm btn-primary m-1"
              onClick={this.checkSentence}
            >
              Check!
            </button>
            <div className="float-right">
              <small id="characters" className="text-secondary m-1">
                0 characters
              </small>
              <small id="words" className="text-secondary m-1">
                0 words
              </small>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="doc_title mx-3 mt-2 suggestions_title">
              All suggestions
            </div>
            {/* {this.state.isLoading ? (
              <div className="ml-3 mt-5 text-primary">
                <div class="loader"></div> Loading Suggestions...
              </div>
            ) : (
              <></>
            )} */}
            <textarea
            rows="8"
            id="content"
            onKeyPress={(e) => this.onChangeContent(e)}
            onKeyDown={this.updateVal}
            onChange={this.updateVal}
            className="form-control content m-2 mt-5"
            placeholder="OUTPUT"
            value={this.state.corrections.map((e, i) => e[0]).join(", ")}
            />

            {
              console.log("this is correction",this.state.corrections)
            }
            <div
              className="suggestions_content m-1 mt-5"
              id="suggestions_content"
            >
              {/* {this.state.corrections.map((e, i) => (
                <SuggestionCard
                  key={i}
                  title={e[0]}
                  correction={e[1]}
                  index={e[2]}
                  id={"suggestion_" + i}
                  deleteSuggestionCard={this.deleteSuggestionCard}
                  replaceContent={this.replaceContent}
                  addToDictionary={this.addToDictionary}
                />
              ))} */}

              {this.state.isLoading ? (
              <div className="ml-3 mt-5 text-primary">
                <div class="loader"></div> Loading Suggestions...
              </div>
            ) : (
              <>
              {/* {console.log("this is t1 ",this.state.t2)} */}
              <ReactDiffViewer oldValue={this.state.t1} newValue={this.state.t2} splitView={true} />
              </>
            )} 
              

              {this.state.corrections.length === 0 && !this.state.isLoading ? (
                document.getElementById("content").value === "" ? (
                  <>
                    <img src={img1} width="100%" alt="placeholder" />
                    <center>
                      <small id="s1" className="s1">
                        Nothing to check yet
                      </small>
                      <br />
                      <small id="s2" className="s2">
                        Start writing to check for suggestions and feedback.
                      </small>
                    </center>
                  </>
                ) : (
                  <>
                    <img src={img2} width="100%" alt="placeholder" />
                    <center>
                      <small id="s1" className="s1">
                        No issues found{" "}
                      </small>
                      <br />
                      <small id="s2" className="s2">
                        We ran many checks on your content and found no writing
                        issues. <br /> Check back when you're ready to write
                        some more.{" "}
                      </small>
                    </center>
                  </>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col-sm-1">
            <Assistant
              mistakes={this.state.mistakes}
              mistakesLength={this.state.mistakesLength}
              totalLength={this.state.totalLength}
            />
            <small
              onClick={this.openAssistant}
              className="assistant_open float-right"
            >
              {" "}
              <IoIosArrowBack fill="grey" size="20px" />
              <MdSpellcheck
                className="assistant_icon"
                fill="green"
                size="20px"
              />
            </small>
          </div>
          <iframe
            id="printing-frame"
            name="print_frame"
            src="about:blank"
            title="print_frame"
            style={{ display: "none" }}
          ></iframe>
        </div>
      </div>
    );
  }
}

export default HomePage;
