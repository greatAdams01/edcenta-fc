import React, { useState } from 'react'

const TopicContext = React.createContext<{
  topics: never[]
  setTopics: (topics: never[]) => void
}>({
  topics: [],
  setTopics: (topics: never[]) => {},
})

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const [topics, setTopics] = useState<never[]>([])

  return (
    <TopicContext.Provider value={{ topics, setTopics }}>
      {children}
    </TopicContext.Provider>
  )
}

export default TopicContext
