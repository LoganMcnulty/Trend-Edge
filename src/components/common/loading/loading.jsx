import React from 'react';
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list } from "./generic";

const Loading = ({title='', style}) => {
    return ( 
        <Section className='p-2' style={{backgroundColor:'#4682B4'}}>
            {title ? <Title>{title}</Title> : ''}
            <Article key={style}>
                <ReactLoading type={style} color="#fff" className='p-0' />
            </Article>
        </Section>
     );
}
 
export default Loading;