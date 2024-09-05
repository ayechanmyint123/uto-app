import React, { createContext, useContext, useState } from "react";

interface PromptContextProps {
  title?: string;
  setPromptTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  content?: JSX.Element;
  setPromptContent: React.Dispatch<
    React.SetStateAction<JSX.Element | undefined>
  >;
  promptEnabled: boolean;
  showPrompt: () => void;
  hidePrompt: () => void;
}

interface PromptProviderProps {
  children: React.ReactElement;
}

const PromptContext = createContext({} as PromptContextProps);

export const PromptProvider = (props: PromptProviderProps) => {
  const { children } = props;
  const [title, setPromptTitle] = useState<string>();
  const [content, setPromptContent] = useState<JSX.Element>();
  const [promptEnabled, setPromptEnabled] = useState<boolean>(false);

  const context: PromptContextProps = {
    title,
    setPromptTitle,
    content,
    setPromptContent,
    promptEnabled,
    showPrompt: () => {
      setPromptEnabled(true);
    },
    hidePrompt: () => {
      setPromptEnabled(false);
    },
  };

  return (
    <PromptContext.Provider value={context}>{children}</PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);

  if (context === undefined) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }

  return {
    ...context,
  };
};
