import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import * as ModalActions from "./../store/modal/actions";
import { Row, Col, Card, CardBody } from "reactstrap";
import ToolBar from "./Toolbar/Toolbar";
import PageHader from "./../components/PageHader/PageHeader";
// import {Surface,Image,Text} from 'react-canvas'
import { Stage, Layer, Line, Text, Rect, Transformer } from "react-konva";
// import URLImage from "./URLImage";
import reactImageSize from "react-image-size";
import Rectangel from "./Rectangel";
import Konva from "konva";
import nextId from "react-id-generator";
import RectsInfo from "./RectsInfo";

const RECT_TEMPLATE = {
  fill: "rgba(176,176,155,0.4)",
  stroke: "rgba(0,0,255,0.5)",
  strokeWidth: 1,
  visible: false,
  x: 0,
  y: 0,
};

let x1, y1, x2, y2, bg;
class FormTools extends React.Component {
  state = {
    image: this.props.location.pathname.replace("/file/", ""),
    stageW: null,
    stageH: null,
    VlineY: 15,
    VlineX: 15,
    HlineY: 15,
    HlineX: 15,
    showVLine: true,
    ACTIVE_ACTION: null,
    rectangles: [],
    tmpRect: null,
    selectedId: null,
    
  };

  stage = createRef();
  toolsLayer = createRef();
  transformer = createRef();
  rectGroup = createRef()



  getSize = async () => {
    const { image } = this.state;
    if (this.state.image !== null) {
      try {
        const { width, height } = await reactImageSize(image);
        this.setState({ stageW: width, stageH: height });
      } catch {
        console.log("error");
      }
    }
  };

  toogleVertikalLine = () => {
    this.setState({ showVLine: !this.state.showVLine });
    console.log(this.state.showVLine);
  };

  toggleFrame = (e) => {
    this.setState({ addFrame: !this.state.addFrame });
  };

  toggleAction = (ACTION_NAME) => {
    const { ACTIVE_ACTION } = this.state;

    if (ACTIVE_ACTION === ACTION_NAME) ACTION_NAME = null;

    this.setState({ ACTIVE_ACTION: ACTION_NAME });
  };

  selectRect = (e) => {
    const id = e.currentTarget.getAttribute("id");
    const intId = parseInt(id)
    const { rectangles } = this.state;
    console.log(id);
    this.setState({ selectedId: intId, tmpRect: rectangles[id] });

  };

  componentDidMount() {
    if (this.state.image === null) {
      this.setState({
        image: this.props.location.pathname.replace("/file/", ""),
      });
    }

    this.getSize();
  }

  checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      this.setState({ selectedId: null });

    }
  };
 
  //ADD FRAME
  onMouseDown_ADD_FRAME = (e) => {
    // if (this.state.ACTIVE_ACTION === "ADD_FRAME") {
    const rect = new Konva.Rect(RECT_TEMPLATE);
    const id = nextId();

    let stage = this.stage.current;
    if (e.target !== stage) {
      return;
    }

    const x = stage.getPointerPosition().x;
    const y = stage.getPointerPosition().y;

    x1 = x;
    y1 = y;
    x2 = x;
    y2 = y;

    rect.visible(true);
    rect.width(0);
    rect.height(0);
    rect.id(id);
   
    this.toolsLayer.current.add(rect);
    this.setState({ tmpRect: rect });
    // }
  };
  onMouseMove_ADD_FRAME = (e) => {
    let stage = this.stage.current;
    // if (this.state.ACTIVE_ACTION === "ADD_FRAME") {
    const { tmpRect: rect } = this.state;

    if (e.target !== stage || rect === null) {
      return;
    }

    x1 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

   setTimeout(()=> {
    rect.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
   }, 0)

    rect.scaleX(1);
    rect.scaleY(1);

    this.setState({ tmpRect: rect });
    // }
  };
  onMouseUp_ADD_FRAME = (e) => {
    const { rectangles, tmpRect, redy } = this.state;
    if (!tmpRect.visible()) {
      return;
    }
    setTimeout(() => tmpRect.visible(false));

    if (tmpRect) {
      this.props.showModal("NEW_RECT_CONFIG", { tmpRect: tmpRect, rectangles:rectangles, toolsLayer:this.toolsLayer.current});
      // tmpRect.setAttrs({
      //   fill: "red"
      // }) 
      rectangles.push(tmpRect);    

    }
    this.setState({ ACTIVE_ACTION: null, tmpRect: null, rectangles });
  };

  //TRANSFORM FRAME
  onMouseDown_TRANSFORM_FRAME = (e) => {
    const { tmpRect } = this.state;
    setTimeout(() => tmpRect.visible(false));
  };
  onMouseMove_TRANSFORM_FRAME = this.onMouseMove_ADD_FRAME;
  onMouseUp_TRANSFORM_RECT = this.onMouseUp_ADD_FRAME;


  updateInfo = () => {
    const {tmpRect} = this.state
    
    console.log(tmpRect.getPointerPosition().x);
  }

  onMouseMove_DRAG_FRAME = (e) => {
    let stage = this.stage.current;
    const { rectangles, selectedId } = this.state;

    const rect = rectangles[selectedId];

    if (!rect) return;

    rect.x = stage.getPointerPosition().x;
    rect.y = stage.getPointerPosition().y;

    rectangles[selectedId] = rect;
    this.setState({ rectangles });
  };

  onTransformEnd = (e) => {};

  setColor = (color) => {
    bg = color
  }

  deleteRect = (e) => {
    const {rectangles, tmpRect} = this.state
    const pos = rectangles.indexOf(tmpRect)
    rectangles.splice(pos, 1)
    console.log(rectangles);
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
    console.log("Enter is Pressed ");
  }
  } 
  deselectRect= () => {
    if(this.state.selectedId !== null) {
      this.setState({ selectedId: null})
    }
  }

  saveSample=()=> {
    console.log(this.state.rectangles)
  }


  render() {
    const disabledColor = "rgba(185,195,195, 0.2)";
    const {
      image,
      stageH,
      stageW,
      VlineX,
      HlineY,
      rectangles,
      ACTIVE_ACTION,
      selectedId,
      tmpRect,
    } = this.state;

    const ShowRuler = () => {
      const VCountF = Math.ceil(stageH / 100);
      const VCountS = Math.ceil(stageH / 10);
      const HCountF = Math.ceil(stageW / 100);
      const HCountS = Math.ceil(stageW / 10);
      let VLF = [];
      let VLS = [];
      let HLF = [];
      let HLS = [];
      let SmalH;
      for (let i = 0; i < VCountF; i += 1) {
        VLF.push(i * 100 + 15);
      }
      for (let i = 0; i < VCountS; i += 1) {
        VLS.push(i * 10 + 25);
      }
      for (let i = 0; i < HCountF; i += 1) {
        HLF.push(i * 100 + 15);
      }
      for (let i = 0; i < HCountS; i += 1) {
        HLS.push(i * 10 + 25);
      }
      SmalH = HLS.filter(function (x) {
        return HLF.indexOf(x) < 0;
      });
      return (
        <>
          {VLF.map((x) => (
            <>
              <Line
                x={0}
                y={x}
                stroke="#16222A"
                height={5}
                points={[0, 0, 15, 0, 0, 0]}
                strokeWidth={1}
              />
            </>
          ))}

          {VLS.map((x) => (
            <>
              <Line
                x={8}
                y={x}
                stroke="#3A6073"
                height={5}
                points={[0, 0, 7, 0, 0, 0]}
                strokeWidth={1}
              />
            </>
          ))}

          {HLF.map((x) => (
            <>
              <Line
                x={x}
                y={0}
                stroke="#16222A"
                points={[0, 15, 0, 0, 0, 0]}
                strokeWidth={1}
              />
            </>
          ))}

          {SmalH.map((x) => (
            <>
              <Line
                x={x}
                y={8}
                stroke="#3A6073"
                points={[0, 7, 0, 0, 0, 0]}
                strokeWidth={1}
              />
            </>
          ))}
        </>
      );
    };
    return (
      <>
        <div className="page-content" >
          <div className="container-fluid">
            <PageHader>Forms Tools</PageHader>
            <ToolBar
              toogleVertikalLine={this.toogleVertikalLine}
              addFrame={this.toggleFrame}
              toggleAction={this.toggleAction}
              selectedRect={rectangles[selectedId]}
              SClass={ACTIVE_ACTION === "ADD_FRAME" && "selectedToolButton"}
              deleteRect = {this.deleteRect}
              rrr = {this.state.rectangles}
              saveSample = {this.saveSample}
            />
            <div className="sampleContainer">
              <Stage
                width={stageW + 15}
                height={stageH + 15}
                id="MainStage"
                style={{
                  background: `url("${image}")`,
                  width: stageW + 15,
                  height: stageH + 15,
                  display: "block",
                  backgroundPositionX: "15px",
                  backgroundPositionY: "15px",
                  backgroundRepeat: "no-repeat",
                }}
                onMouseDown={(e) => {
                  this.checkDeselect(e);
                  switch (ACTIVE_ACTION) {
                    case "ADD_FRAME":
                      this.onMouseDown_ADD_FRAME(e);
                      return true;

                    case "TRANSFORM_RECT":
                      this.onMouseDown_TRANSFORM_FRAME(e);
                      return true;

                    default:
                      return false;
                  }
                }}
                onMouseMove={(e) => {
                  switch (ACTIVE_ACTION) {
                    case "ADD_FRAME":
                      this.onMouseMove_ADD_FRAME(e);
                      return true;
                    case "TRANSFORM_RECT":
                      this.onMouseMove_TRANSFORM_FRAME(e);
                      return true;

                    default:
                      return false;
                  }
                }}
                onMouseUp={(e) => {
                  switch (ACTIVE_ACTION) {
                    case "ADD_FRAME":
                      this.onMouseUp_ADD_FRAME(e);
                      return true;

                    case "TRANSFORM_RECT":
                      this.onMouseUp_TRANSFORM_RECT(e);
                      return true;

                    default:
                      return false;
                  }
                }}
                ref={this.stage}
              >
                <Layer>
                  {/* <URLImage src={image} x="15" y="15" /> */}
                  <ShowRuler />

                  {this.state.showVLine !== false && (
                    <>
                      <Line
                        x={this.state.VlineX}
                        y={this.state.VlineY}
                        draggable
                        stroke={this.state.isDraggingX ? "#03a9f4" : "black"}
                        onDragStart={() => {
                          this.setState({
                            isDraggingX: true,
                          });
                        }}
                        onDragEnd={(e) => {
                          this.setState({
                            isDraggingX: false,
                            VlineX: e.target.x(),
                            VlineY: this.state.VlineY,
                          });
                        }}
                        dragBoundFunc={(e) => {
                          e.y = this.state.VlineY;
                          return e;
                        }}
                        height={stageH}
                        points={[0, 0, 0, stageH + 15, 0, 0]}
                        strokeWidth={2}
                        className="linera-line"
                        width={100}
                      />
                      {this.state.isDraggingX === false && (
                        <Rect
                          x={15}
                          y={15}
                          width={VlineX <= 15 ? 0 : VlineX - 15}
                          height={stageH}
                          fill={disabledColor}
                          shadowBlur={5}
                        />
                      )}

                      {/* //vertikal */}
                      <Line
                        x={this.state.HlineX}
                        y={this.state.HlineY}
                        draggable
                        stroke={this.state.isDraggingY ? "#03a9f4" : "black"}
                        onDragStart={() => {
                          this.setState({
                            isDraggingY: true,
                          });
                        }}
                        onDragEnd={(e) => {
                          this.setState({
                            isDraggingY: false,
                            HlineY: e.target.y(),
                            HlineX: this.state.HlineX,
                          });
                        }}
                        dragBoundFunc={(e) => {
                          e.x = this.state.HlineX;
                          return e;
                        }}
                        points={[stageW, 0, 0, 0, 0, 0]}
                        strokeWidth={2}
                        className="linera-line"
                        width={100}
                      />

                      {this.state.isDraggingY === false && (
                        <Rect
                          x={15}
                          y={15}
                          width={stageW}
                          height={HlineY <= 15 ? 0 : HlineY - 15}
                          fill={disabledColor}
                          shadowBlur={5}
                        />
                      )}
                    </>
                  )}
                </Layer>
                <Layer ref={this.toolsLayer}>
                  {rectangles.map((rect, i) => {
                    return (
                      <Rectangel
                        onKeyPress={this.handleKeyPress}
                        key={i}
                        shapeProps={rect}
                        toggleAction={this.toggleAction}
                        isSelected={i === selectedId}
                        deselectRect = {this.deselectRect}
                        onSelect={(e) => {
                          if(rect){
                            if(rect.fill && typeof rect.fill === "function")
                              rect.fill("green")
                            this.setState({
                              selectedId: i,
                              tmpRect: rect,
                            });
                          }
                        }}
                        onChange={(newRect) => {
                          // this.setState({
                          //   selectedId: i,
                          //   tmpRect: rect,
                          // })
                          // const rects = rectangles.slice();
                          // rects[selectedId] = newRect;
                          // // console.log(newRect);
                          // this.setState({ rectangles: rects});
                          // console.log(rectangles);
                          rectangles[selectedId] = newRect;
                          this.setState({ rectangles });
                        }}
                        onDragMove={this.onMouseMove_DRAG_FRAME}
                        onUpdate = {this.updateInfo}
                      />
                    );
                  })}
                </Layer>
              </Stage>
              <Card>
                <CardBody>
                  <h6>Frames:</h6>
                  <div className="rectsInfo">
                    {rectangles.map((x, i) => (
                      <RectsInfo
                        name={x.attrs.alias}
                        id={i}
                        selectRect={this.selectRect}
                        action={x.attrs.action}
                        field={x.attrs.field}
                        x = {x.attrs.x || x.x}
                        y = {x.attrs.y || x.y}
                        width = {x.attrs.width || x.width}
                        height = {x.attrs.height || x.height}
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
});

export default connect(null, mapDispatchToProps)(FormTools);
