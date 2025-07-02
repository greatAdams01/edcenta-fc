import { CREATE_QUESTION, EDIT_QUESTION } from '@/apollo/mutations/admin'
import { GET_QUESTION } from '@/apollo/queries/admin'
import ModalAuth from '@/components/ModalComp'
import AdminLayout from '@/layout/AdminLayout'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { 
  PlusIcon, 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon,
  PhotoIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddQuestion = () => {
  const path = useRouter()
  const uploadRef = useRef<HTMLInputElement>(null)
  const page = useSearchParams()?.get('worksheet')
  const question = useSearchParams()?.get('question')
  const [open, setOpen] = useState(false)
  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')
  const [isObjective, setIsObjective] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [description, setDescription] = useState('')
  const [worksheetId, setWorksheetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  // Add missing required fields
  const [questionType, setQuestionType] = useState('MULTIPLE_CHOICE')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [points, setPoints] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  
  let option = {
    option: '',
    isCorrect: false,
  }
  
  const [getQuestion] = useLazyQuery(GET_QUESTION, {
    variables: { id: question },
    onCompleted: (data) => {
      console.log('Data:', data)
      const selectedValuesArray = data.question.options.map(
        ({ option, isCorrect }: any) => ({ option, isCorrect }),
      )
      setOptions(selectedValuesArray)
      setWorksheetId(data.question.worksheetId)
      setIsObjective(data.question.isObjective)
      setTitle(data.question.title)
      setExplanation(data.question.explanation)
      setDescription(data.question.body[0].text)
      setImg(data.question.body[0].img)
    },
    onError: (error) => {
      console.log('Error:', error)
    },
  })
  const [options, setOptions] = useState([option])

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    variables: {
      title,
      questionType,
      isObjective,
      options,
      explanation,
      body: [{
        img,
        text: description,
      }],
      worksheetId: page,
      difficulty,
      points,
      tags,
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Question created successfully!')
      setIsSubmitting(false)
      setTimeout(() => {
        path.push(`/admin/subjects/topics/worksheets/worksheet/${page}`)
      }, 2000)
    },
    onError: (error) => {
      toast.error('Error creating Question: ' + error.message)
      setIsSubmitting(false)
    },
  })

  const [editQuestion] = useMutation(EDIT_QUESTION, {
    variables: {
      id: question,
      input: {
        title,
        questionType,
        isObjective,
        options,
        explanation,
        body: [{
          img,
          text: description,
        }],
        worksheetId,
        difficulty,
        points,
        tags,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      toast.success('Question updated successfully!')
      setIsSubmitting(false)
      setTimeout(() => {
        path.push(`/admin/subjects/topics/worksheets/worksheet/${worksheetId}`)
      }, 2000)
    },
    onError: (error) => {
      toast.error('Error updating question: ' + error.message)
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (explanation.trim() === '') {
      toast.error('Explanation field cannot be empty')
      setIsSubmitting(false)
      return
    }
    
    if (description.trim() === '') {
      toast.error('Description field cannot be empty')
      setIsSubmitting(false)
      return
    }

    // Check if any body item is empty
    if (isObjective) {
      for (let item of options) {
        if (item.option.trim() === '') {
          toast.error('All option fields must be filled')
          setIsSubmitting(false)
          return
        }
      }
      
      if (options.length !== 4) {
        toast.error('Objective questions must have exactly 4 options')
        setIsSubmitting(false)
        return
      }
      
      const hasActive = options.some((item) => item.isCorrect === true)
      if (!hasActive) {
        toast.error('Please select a correct answer')
        setIsSubmitting(false)
        return
      }
    }

    if (page === null) {
      editQuestion()
      return
    }
    createQuestion()
  }

  const handleBodyItemChange = (
    index: number,
    field: string,
    value: string | Boolean,
  ) => {
    setOptions(
      options.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const setActiveIndex = (index: number) => {
    const updatedItems = options.map((item, i) => ({
      ...item,
      isCorrect: i === index,
    }))
    setOptions(updatedItems)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImg(reader.result?.toString() || '')
      }
      reader.readAsDataURL(file)
    }
  }

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { option: '', isCorrect: false }])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const getQuestionTypeColor = () => {
    return isObjective ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const getQuestionTypeIcon = () => {
    return isObjective ? '📝' : '✍️'
  }

  useEffect(() => {
    if (question !== null) {
      getQuestion()
    }
  }, [getQuestion, question])

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => path.back()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <IoIosArrowBack className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-500">
                    {page !== null ? 'Add Question' : 'Edit Question'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  <EyeIcon className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={(e) => handleSubmit(e)}
                  disabled={isSubmitting || loading}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>{page !== null ? 'Create Question' : 'Update Question'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {page !== null ? 'Add New Question' : 'Edit Question'}
                    </h2>
                    <p className="text-sm text-gray-500">Create or update question content and settings</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getQuestionTypeColor()}`}>
                    <span className="mr-1">{getQuestionTypeIcon()}</span>
                    {isObjective ? 'Objective' : 'Subjective'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'basic', name: 'Basic Info', icon: DocumentTextIcon },
                  { id: 'content', name: 'Question Content', icon: AcademicCapIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Question Type Toggle */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Question Type</h3>
                        <p className="text-sm text-gray-500">
                          Choose between objective (multiple choice) or subjective (open-ended) questions
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${!isObjective ? 'text-gray-900' : 'text-gray-500'}`}>
                          Subjective
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isObjective}
                            onChange={(e) => setIsObjective(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                        <span className={`text-sm font-medium ${isObjective ? 'text-gray-900' : 'text-gray-500'}`}>
                          Objective
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-2">
                      Question Explanation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[120px] resize-y"
                      placeholder="Provide a detailed explanation for this question..."
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  {/* Points */}
                  <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                      Points <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter points for this question..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags.join(', ')}
                      onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter tags separated by commas (e.g., math, algebra, equations)..."
                    />
                    <p className="text-sm text-gray-500 mt-1">Tags help categorize and search for questions</p>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Question Type:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getQuestionTypeColor()}`}>
                          {getQuestionTypeIcon()} {isObjective ? 'Objective' : 'Subjective'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 bg-gray-100 text-gray-800">
                          {difficulty}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Points:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 bg-green-100 text-green-800">
                          {points} point{points !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Explanation:</span>
                        <p className="text-gray-900 mt-1">{explanation || 'Not provided'}</p>
                      </div>
                      {tags.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {isObjective && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Options:</span>
                          <p className="text-gray-900">{options.length}/4</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Question Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Content <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-lg">
                      <ReactQuill
                        value={description}
                        onChange={(content, delta, source, editor) => setDescription(editor.getHTML())}
                        className="min-h-[200px]"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image'],
                            ['clean']
                          ]
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Image
                    </label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          ref={uploadRef}
                        />
                        <button
                          onClick={() => uploadRef.current?.click()}
                          className="cursor-pointer"
                        >
                          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">
                            {img ? 'Click to change image' : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </button>
                      </div>
                      
                      {img && (
                        <div className="relative">
                          <img
                            src={img}
                            alt="Question preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            onClick={() => setImg('')}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Objective Options */}
                  {isObjective && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Multiple Choice Options</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {options.length}/4 options
                          </span>
                          {options.length < 4 && (
                            <button
                              onClick={addOption}
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                            >
                              <PlusIcon className="w-3 h-3" />
                              Add Option
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Option {index + 1}
                              </label>
                              <input
                                value={option.option}
                                onChange={(e) => handleBodyItemChange(index, 'option', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder={`Enter option ${index + 1}...`}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setActiveIndex(index)}
                                className={`p-2 rounded-md transition-colors ${
                                  option.isCorrect
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                                title={option.isCorrect ? 'Correct answer' : 'Mark as correct'}
                              >
                                <CheckIcon className="w-5 h-5" />
                              </button>
                              {options.length > 1 && (
                                <button
                                  onClick={() => removeOption(index)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                  title="Remove option"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {options.length === 0 && (
                        <div className="text-center py-8">
                          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Options Added</h3>
                          <p className="text-gray-500 mb-4">Add multiple choice options for this question</p>
                          <button
                            onClick={addOption}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                          >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add First Option</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {isObjective ? `${options.length} option${options.length !== 1 ? 's' : ''}` : 'Subjective question'}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e)}
                    disabled={isSubmitting || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>{page !== null ? 'Create Question' : 'Update Question'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <ModalAuth
          isOpen={open}
          XIcon={true}
          onClose={() => setOpen(false)}
          styling={'w-[800px] m-auto'}
        >
          <div className="bg-white rounded-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Question Preview
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getQuestionTypeColor()}`}>
                <span className="mr-1">{getQuestionTypeIcon()}</span>
                {isObjective ? 'Objective Question' : 'Subjective Question'}
              </span>
            </div>

            <div className="space-y-6">
              {img && (
                <div className="text-center">
                  <img
                    src={img}
                    alt="Question image"
                    className="mx-auto max-h-64 rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Question Content</h3>
                  <div 
                    className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: description || 'No content provided' }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Explanation</h3>
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">
                    {explanation || 'No explanation provided'}
                  </p>
                </div>

                {isObjective && options.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Options</h3>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            option.isCorrect 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="text-gray-700">
                            {String.fromCharCode(65 + index)}. {option.option || 'Empty option'}
                          </span>
                          {option.isCorrect && (
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <CheckIcon className="w-4 h-4" />
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalAuth>

        <ToastContainer />
      </div>
    </AdminLayout>
  )
}

export default AddQuestion
