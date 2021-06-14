import React from 'react';
import ReactLoading from "react-loading";
import { Section, Title, Article} from "./generic";

const Loading = ({title='', type}) => {
    return ( 
        <Section className='p-2' style={{backgroundColor:'#4682B4'}}>
            {title ? <Title>{title}</Title> : ''}
            <Article key={type}>
                <ReactLoading type={type} color="#fff" className='p-0' />
            </Article>
        </Section>
     );
}
 
export default Loading;