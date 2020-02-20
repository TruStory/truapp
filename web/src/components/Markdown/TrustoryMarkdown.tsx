import * as React from 'react';
import { ReactType } from 'react';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';

interface Props {
  style?: React.CSSProperties;
  plugins?: any[];
  renderers?: { [nodeType: string]: ReactType};
  children: string;
}

const TrustoryMarkdown = (props: Props) => {
  const { plugins, renderers, style, children } = props;

  const _plugins = plugins ? plugins : [];

  return (
    <div style={ style }>
      <ReactMarkdown
        className='markdown'
        source={ children }
        linkTarget={ '_blank' }
        includeNodeIndex={ true }
        plugins={ [breaks, ..._plugins] }
        renderers={ renderers }
        parserOptions={ { commonmark: true } }
      />
    </div>
  );
};

TrustoryMarkdown.defaultProps = {
  plugins: [],
};

export default TrustoryMarkdown;
