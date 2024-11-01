
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getOneRoom, postMessage } from '../http/roomsApi';
import { Context } from '..';
import io from 'socket.io-client';



const GameSetup = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const {user} = useContext(Context)


console.log(user._user.id)
  const {id} = useParams();

  useEffect( () => {
     getOneRoom (id).then(data => 
        setMessages([... Array.from(data.message)])
       )
       const newSocket = io('http://localhost:3000'); 
       setSocket(newSocket);
   
       return () => {
        
         newSocket.disconnect();
       };
  
  }, [])



  useEffect(() => {
   
    if (socket) {
      socket.on('chatUpdated', (id) => {
        getOneRoom (id).then(data => 
          setMessages([... Array.from(data.message)])
         )
      });
    }

    return () => {
      if (socket) {
        socket.off('chatUpdated');
      }
    };
  }, [socket]);


  const handleSubmit = (e) => {
  
    console.log("RRRRRRRRRRRRRRRRR", newMessage);
  
    postMessage(id, newMessage, user._user.id)
      .then((data) => {
        setMessages((prevMessages) => [...prevMessages, data]); 
        setNewMessage(''); 
      })
      .catch((error) => {
        console.error("Error while posting message:", error);
      });

      if (socket) {
        socket.emit('updateChat', id);
      }
     
  };

  messages.map((i) => (
   console.log(i)
  )
  )
  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={8}>
          <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', paddingBottom:'10px' }}>
          {messages.map((message) => (
  <div key={message._id} style={{ marginBottom: '30px' }}>
    <p style={{ marginBottom: '5px', fontSize: '16px' }}>
      <strong>From: </strong>{message.user_id} 
    </p>
    <p style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', fontFamily: 'cursive', fontSize: '20px' }}>
      {message.message} {/* Вывод текста сообщения */}
    </p>
  </div>
))}
          </div>
          <Form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <Form.Group controlId="message">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4" 
            >
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default GameSetup;

