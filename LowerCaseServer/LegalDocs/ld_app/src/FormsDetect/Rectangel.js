import { truncate } from "lodash";
import React, { Component, createRef } from "react";
import { Rect, Transformer,Label, Text, Tag } from "react-konva";


class Rectangel extends Component {

  shapeRef = React.createRef();
  trRef = React.createRef();
  state= {

  }
  
  componentDidUpdate() {
    if (this.props.isSelected) {
      this.trRef.current.nodes([this.shapeRef.current]);
      this.trRef.current.getLayer().batchDraw();
    }
  }

  
  render() {
    let tmpRect = this.shapeRef.current;
    
   
        return (
      <>
        <Rect
          onClick={this.props.onSelect}
          onKeyPress = {this.props.onKeyPress}
          ref={this.shapeRef}
          {...this.props.shapeProps}
          draggable
          onDragStart={(e) => {
            // this.props.onSelect(e);
            this.props.deselectRect()
            tmpRect.setAttrs({
              fill: "rgba(25,255,125,0.5)"
            }) 
            this.props.toggleAction("DRAG_RECT");
          }}
          onDragMove={this.props.onDragMove}
          onDragEnd={(e) => {
            tmpRect.setAttrs({
              fill: "rgba(176,176,155,0.4)"
            }) 
            this.props.onSelect(e);

            this.props.onChange({
              ...this.props.shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });

            this.props.toggleAction(null);
          }}
          // onTransform = {console.log(2)}
          onTransformEnd={(e) => {
            const node = this.shapeRef.current;
            
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            this.props.onChange({
              ...this.props.shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
        />
        {/* <Text text="Some text on canvas" fontSize={15} /> */}
        <Rect/>
        {this.props.isSelected && (
          <Transformer
            ref={this.trRef}
            rotateEnabled = {false}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />

        )}
      </>
    );
  }
}

export default Rectangel;
