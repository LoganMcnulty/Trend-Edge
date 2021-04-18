// Out of house
import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const ServeToDash = ({children, small=[10,2], med=[9,0], large=[10,0]}) => {
     return ( 
         <>
             <Container fluid className='mt-4 px-4 bg-secondary'>
                 <Row className='justify-content-center p-0 pt-5'>
                     <h1><br /></h1>
                     <Col xs={{span:small[0], offset:small[1]}} md={{span:med[0], offset:med[1]}} lg={{span:large[0], offset:large[1]}} className='p-0'>
                        
                        {/* Shit for the content of dashboard goes here 😃 */}
                            {children}

                     </Col>
                 </Row>
             </Container>
 
         </>
     );
}
 
export default ServeToDash;