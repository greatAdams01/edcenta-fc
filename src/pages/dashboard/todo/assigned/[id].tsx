import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  UPDATE_ASSIGNMENT,
  UPDATE_ASSIGNMENT_SCORE,
} from '@/apollo/mutations/dashboard'
import { getCookie } from 'cookies-next'
import { WORKSHEET_BY_ID } from '@/apollo/queries/admin'
import { IQuestion, IWorksheet2 } from '../../../../../types'
import { motion } from 'framer-motion'
import AppLayout from '@/layout/AppLayout'
import { BarLoader } from 'react-spinners'
import { IoIosArrowBack } from 'react-icons/io'
import { QUESTIONS } from '@/apollo/queries/dashboard'
import ModalAuth from '@/components/ModalComp'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/utils/toast'

type WorksheetProps = {
  _id: string
}
interface DifficultyIndicatorProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'

const Assigned: React.FC<WorksheetProps> = () => {
  const router = useRouter()
  const path = useRouter()
  const { id } = router.query
  let currentAssignmentId: string | null = null
  if (typeof window !== 'undefined') {
    currentAssignmentId = localStorage.getItem('currentAssignmentId')
  }
  const authData: any = getCookie('Authdata')
  let authDataId: string | null = null
  if (authData) {
    try {
      authDataId = JSON.parse(authData)._id
    } catch (error) {
      console.error('Error parsing authData:', error)
    }
  }
  const [questionsList, setQuestionsList] = useState<IQuestion[]>([])
  const [isSubmit, setIsSubmit] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSelectedOptions = localStorage.getItem('selectedOptions')
      console.log(savedSelectedOptions)
      return savedSelectedOptions
        ? JSON.parse(savedSelectedOptions)
        : new Array(questionsList.length).fill(null)
    } else {
      return []
    }
  })
  const [worksheet, setWorksheet] = useState<IWorksheet2>({
    title: '',
    body: [],
    difficulty: '',
    levelId: '',
    subjectId: '',
  })
  const [startQuestions, setStartQuestions] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedStartQuestions = localStorage.getItem('startQuestions')
      return savedStartQuestions ? JSON.parse(savedStartQuestions) : false
    } else {
      return false
    }
  })
  const [scoreData, setScoreData] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('score')
      return savedScore ? JSON.parse(savedScore) : null
    } else {
      return null
    }
  })
  const [showScore, setShowscore] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedStartQuestions = localStorage.getItem('showScore')
      return savedStartQuestions ? JSON.parse(savedStartQuestions) : false
    } else {
      return false
    }
  })
  const [answers, setAnswers] = useState<
    { questionId: string; optionId: string; answer: string; correct: boolean }[]
  >(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('answers')
      return savedAnswers
        ? JSON.parse(savedAnswers)
        : new Array(questionsList.length).fill({
            questionId: '',
            optionId: '',
            answer: '',
            correct: false,
          })
    } else {
      return []
    }
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    () => {
      if (typeof window !== 'undefined') {
        const savedCurrentQuestionIndex = localStorage.getItem(
          'currentQuestionIndex',
        )
        return savedCurrentQuestionIndex
          ? JSON.parse(savedCurrentQuestionIndex)
          : 0
      } else {
        return 0
      }
    },
  )

  useEffect(() => {
    if (id) {
      localStorage.setItem('topicId', id as string)
    }
  }, [id])

  useEffect(() => {
    localStorage.setItem('startQuestions', JSON.stringify(startQuestions))
  }, [startQuestions])
  useEffect(() => {
    localStorage.setItem('showScore', JSON.stringify(showScore))
  }, [showScore])

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    localStorage.setItem(
      'currentQuestionIndex',
      JSON.stringify(currentQuestionIndex),
    )
  }, [currentQuestionIndex])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions))
    }
  }, [selectedOptions])
  useEffect(() => {
    if (scoreData !== null) {
      const scorePercentage = (scoreData / questionsList.length) * 100
      if (typeof window !== 'undefined') {
        localStorage.setItem('score', JSON.stringify(scorePercentage))
      }
      setScore(scorePercentage)
      console.log(scoreData, scorePercentage)
    }
  }, [scoreData, questionsList.length])

  // const input = {
  //   studentId: authDataId,
  //   worksheetId: id,
  //   status: score && score <= 35 ? 'FAILED' : 'DONE',
  //   score: scoreData,
  //   answers: answers.map((answer) => ({
  //     questionId: answer.questionId,
  //     answer: answer.optionId,
  //     isCorrect: answer.correct,
  //   })),
  // }

  const [updateAssignment, {}] = useMutation(UPDATE_ASSIGNMENT_SCORE, {
    variables: {
      updateAssignmentScoreId: currentAssignmentId,
      score: `${scoreData}`,
    },
    onCompleted: (data) => {
      setIsSubmit(false)
      setStartQuestions(false)
      setShowscore(true)
      setShowExplanation(false)
      showToast('success', 'Assignment updated successfully')
      console.log('Assignment updated successfully')
    },
    onError: (error) => {
      console.error('Error updating assignment:', error)
      showToast('error', error.message)
    },
  })

  const handleSubmit = () => {
    let correctAnswers = 0
    questionsList.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer && userAnswer.correct) {
        correctAnswers += 1
      }
    })
    setScoreData(correctAnswers)
  }
  useEffect(() => {
    if (scoreData !== null) {
      updateAssignment()
    }
  }, [scoreData])

  const [getWorksheet, { loading, error, data }] = useLazyQuery(
    WORKSHEET_BY_ID,
    {
      variables: { id: id },
      onCompleted: (data) => {
        console.log('Data:', data)
        setWorksheet(data.worksheet)
      },
      onError: (error) => {
        console.log('Error:', error)
      },
    },
  )

  useEffect(() => {
    getWorksheet()
  }, [id])

  const [
    getQuestions,
    { loading: questionsLoading, error: questionsError, data: questionsData },
  ] = useLazyQuery(QUESTIONS, {
    variables: {
      page: 1,
      limit: 50,
      filter: '',
      levelId: worksheet.levelId,
      subjectId: worksheet.subjectId,
      worksheetId: id,
    },
    onCompleted: (data) => {
      console.log('Questions Data:', data)
      setQuestionsList(data.questions.data)
    },
    onError: (error) => {
      console.log('Questions Error:', error)
    },
  })

  useEffect(() => {
    if (worksheet.levelId && worksheet.subjectId && id) {
      getQuestions()
    }
  }, [worksheet, id])

  const getQuestionColor = (index: number) => {
    const answer = answers[index]
    if (!answer || Object.keys(answer).length === 0) {
      return '#EEEEEE' // replace with the color for unanswered questions
    }
    return answer.correct ? 'rgb(22 163 74)' : 'rgb(254 202 202)'
  }

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
  ) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions]
      newSelectedOptions[currentQuestionIndex] = optionIndex
      return newSelectedOptions
    })
  }

  const checkAnswer = () => {
    const selectedOption = selectedOptions[currentQuestionIndex]
    if (selectedOption !== null) {
      const question = questionsList[currentQuestionIndex]
      const isCorrect = question.options[selectedOption]?.isCorrect ?? false

      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers]
        newAnswers[currentQuestionIndex] = {
          questionId: question._id,
          optionId: selectedOption.toString(),
          answer: question.options[selectedOption]?.option ?? '',
          correct: isCorrect,
        }

        return newAnswers
      })
    }
  }
  if (questionsList.length === 0 || questionsLoading) {
    return (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
        <BarLoader color="#000000" loading={true} width={150} height={8} />
      </div>
    )
  }
  const handleReviewAnswers = () => {
    setStartQuestions(true)
    setCurrentQuestionIndex(0)
    setShowscore(false)
  }
  const handleRetryActivity = () => {
    setSelectedOptions(new Array(questionsList.length).fill(null))
    setAnswers([])
    setStartQuestions(true)
    setCurrentQuestionIndex(0)
    setShowscore(false)
    setScore(null)
    setScoreData(null)
  }
  const handleExitActivity = () => {
    router.push('/dashboard/todo')
    setSelectedOptions(new Array(questionsList.length).fill(null))
    setAnswers([])
    setStartQuestions(false)
    setCurrentQuestionIndex(0)
    setShowscore(false)
    setScore(null)
    setScoreData(null)
    localStorage.removeItem('currentAssignmentId')
  }

  const question = questionsList[currentQuestionIndex]
  const answer = answers[currentQuestionIndex]
  const countUnansweredQuestions = () => {
    return selectedOptions.filter((option) => option === null).length
  }

  const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
    difficulty,
  }) => {
    const boxCount =
      {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
      }[difficulty as 'EASY' | 'MEDIUM' | 'HARD'] || 0

    return (
      <div className="flex">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`m-1 h-[20px] w-[28px] rounded-[2.86px] ${index < boxCount ? 'bg-[#23BDBD]' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
    )
  }
  function isDifficultyLevel(
    difficulty: string,
  ): difficulty is DifficultyLevel {
    return ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)
  }
  const difficulty: string = worksheet.difficulty
  return (
    <AppLayout>
      {showScore ? (
        <div className="flex flex-col items-center justify-between space-y-4 rounded-lg bg-white p-4 shadow-md">
          <div className="flex w-full items-center justify-start gap-x-8">
            <div className="flex flex-col items-center">
              <div
                className={`text-4xl font-bold ${
                  score && score >= 50 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {score}%
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-800">
                {score && score >= 50 ? (
                  <span>Congrats!!!, you passed!</span>
                ) : (
                  <span>Try again for a better score</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleReviewAnswers}
              className="inline-flex justify-center rounded-md bg-[#23BDBD] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400"
            >
              Review Answers
            </button>
            <button
              onClick={handleRetryActivity}
              className="inline-flex justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400"
            >
              Retry Activity
            </button>
          </div>
          <button
            onClick={handleExitActivity}
            className="mt-4 inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          >
            Exit Activity
          </button>
        </div>
      ) : !startQuestions ? (
        <motion.div className="space-y-8" animate={{}}>
          <div className="space-y-2 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => path.back()}
              className="mb-6 flex items-center gap-1 text-left text-black"
            >
              <IoIosArrowBack /> <div>Back</div>
            </button>
            <h1 className="w-full text-center text-xl font-semibold uppercase leading-6 text-gray-900 sm:text-2xl">
              {worksheet.title}
            </h1>
            <div className="space-y-2 sm:flex sm:items-center sm:justify-between">
              <div className=" justifiy-start flex items-center gap-2 text-base text-gray-700">
                <div>Difficulty:</div>
                {isDifficultyLevel(difficulty) && (
                  <DifficultyIndicator difficulty={difficulty} />
                )}
              </div>
            </div>
            {worksheet.body.map((item, index) => (
              <div key={index}>
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
                <div className="flex w-full justify-center">
                  {item.img && (
                    <img
                      src={item.img}
                      alt="image"
                      className="h-full max-h-[400px] w-auto"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full space-y-2 text-gray-700">
            <p className="text-md w-full font-semibold sm:text-lg">
              {"Let's have a go at some questions now."}
            </p>
            <div className="flex h-[97px] items-center justify-between border border-[#d8d8d8] px-4">
              <p className=" text-sm text-gray-700">
                This activity has {questionsList.length} questions
              </p>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 max-md:w-[200px] sm:w-auto"
                onClick={() => setStartQuestions(true)}
              >
                Start
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div className="space-y-8" animate={{}}>
          <h1>
            Question {currentQuestionIndex + 1}/{questionsList.length}
          </h1>
          <div className="flex justify-center gap-3">
            {questionsList.map((q, index) => (
              <div
                key={index}
                style={{ backgroundColor: getQuestionColor(index) }}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex h-[20px] w-[28px] items-center justify-center rounded-[2.86px] ${
                  index === currentQuestionIndex ? 'border-2 border-black' : ''
                }`}
              >
                {/* {index + 1} */}
              </div>
            ))}
          </div>
          <h1 className="w-full pt-6 text-center text-xl font-semibold uppercase leading-6 text-gray-900 sm:text-2xl">
            {question && question.title}
          </h1>
          {question &&
            question.body.map((item, index) => (
              <div key={index} className="space-y-3">
                <p className="text-md text-gray-700">{item.text}</p>{' '}
                <div className="flex justify-center">
                  {item.img && (
                    <img
                      src={item.img}
                      alt="image"
                      className="h-full max-h-[400px] w-auto"
                    />
                  )}
                </div>
              </div>
            ))}
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="mr-2 flex items-center space-x-2"
              >
                <input
                  type="radio"
                  id={`option-${currentQuestionIndex}-${optionIndex}`} // Unique id for each radio button
                  name={`option-${currentQuestionIndex}`} // Ensure unique name for each question
                  value={optionIndex}
                  className="h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300 bg-white"
                  checked={
                    selectedOptions[currentQuestionIndex] === optionIndex
                  }
                  onChange={(e) => handleOptionChange(e, optionIndex)}
                  disabled={
                    answers[currentQuestionIndex] &&
                    Object.keys(answers[currentQuestionIndex]).length > 0
                  }
                />
                <label
                  htmlFor={`option-${currentQuestionIndex}-${optionIndex}`} // Associate label with input using htmlFor
                  className={`flex w-max max-w-[370px] items-center justify-center rounded-[8px] p-2 capitalize ${
                    answers[currentQuestionIndex] &&
                    Object.keys(answers[currentQuestionIndex]).length > 0 &&
                    (selectedOptions[currentQuestionIndex] === optionIndex ||
                      option.isCorrect)
                      ? option.isCorrect
                        ? 'bg-green-600 text-white'
                        : 'bg-red-200'
                      : ''
                  }`}
                >
                  {option.option}
                </label>
              </div>
            ))}
          </div>
          {answers[currentQuestionIndex] &&
            Object.keys(answers[currentQuestionIndex]).length > 0 && (
              <div className="flex w-full justify-center">
                <p
                  className={`flex ${answer.correct ? 'bg-green-300 text-black' : 'bg-red-200 text-[#221638]'} h-[60px] w-full max-w-[670px] items-center justify-center rounded-[8px] `}
                >
                  {answer.correct
                    ? 'Your answer was correct'
                    : 'Your answer was incorrect'}
                </p>
              </div>
            )}{' '}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex <= 0}
            >
              Prev
            </button>
            <button
              type="button"
              className={`inline-flex w-[200px] justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto`}
              onClick={() => {
                answers[currentQuestionIndex] &&
                Object.keys(answers[currentQuestionIndex]).length > 0
                  ? setShowExplanation(!showExplanation)
                  : checkAnswer()
              }}
            >
              {answers[currentQuestionIndex] &&
              Object.keys(answers[currentQuestionIndex]).length > 0
                ? 'Show explanation'
                : 'Check Answer'}
            </button>
            {currentQuestionIndex < questionsList.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
              >
                Next
              </button>
            ) : score ? (
              <button
                onClick={() => {
                  setStartQuestions(false)
                  setShowscore(true)
                }}
              >
                Finish
              </button>
            ) : (
              <button onClick={() => setIsSubmit(true)}>Submit</button>
            )}
          </div>
          {showExplanation && (
            <div>
              <p className="text-lg text-gray-800">
                {question && question.explanation}
              </p>
            </div>
          )}
        </motion.div>
      )}
      <ModalAuth
        isOpen={isSubmit}
        XIcon={true}
        onClose={() => setIsSubmit(false)}
        styling={'w-[500px]'}
      >
        <div>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Submit Activity
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to complete the activity?
                  {countUnansweredQuestions() > 0 && (
                    <span>
                      {` You've skipped ${countUnansweredQuestions()} questions.`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 gap-x-2 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto`}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => setIsSubmit(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalAuth>
    </AppLayout>
  )
}

export default Assigned
