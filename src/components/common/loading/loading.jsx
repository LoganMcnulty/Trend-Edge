import React from 'react';
import ReactLoading from "react-loading";
import { Section, Title, Article} from "./generic";

const Loading = ({title='', type, bgColor=''}) => {
    const bgColorFinal = bgColor ? bgColor : '#4682B4'
    return ( 
        <Section className='p-2'
            style={{background:bgColorFinal}}
        >
            {title ? <Title>{title}</Title> : ''}
            <Article key={type}>
                <ReactLoading type={type} color="#fff" background={bgColorFinal} className='p-0' />
            </Article>
        </Section>
     );
}
 
export default Loading;