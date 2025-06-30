import React, { useEffect, useState } from 'react'
import { IWorksheet } from '../../../types'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_TOPIC, UPDATE_WORKSHEET } from '@/apollo/mutations/admin'
import { showToast } from '@/utils/toast'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'
import dynamic from 'next/dynamic'
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  DocumentTextIcon,
  PhotoIcon,
  AcademicCapIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface EditWorksheetProps {
  worksheet: IWorksheet
  // onSave: (updatedUser: IUser) => void;
}

const EditWorksheet: React.FC<EditWorksheetProps> = ({ worksheet }) => {
  const [editedWorksheet, setEditedWorksheet] = useState<IWorksheet>(worksheet)
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('')
  const [bodyItems, setBodyItems] = useState([{ text: '', img: '' }])
  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  let subjectId: string | null = null
  let topicId: string | null = null
  if (typeof window !== 'undefined') {
    subjectId = localStorage.getItem('subjectId')
    topicId = localStorage.getItem('topicId')
  }
  const { data, loading: fetchLearningLoading, error } = useQuery(FETCH_LEARNING)
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target

    if (name === 'bodyText') {
      setEditedWorksheet((prevState: IWorksheet) => ({
        ...prevState,
        body: prevState.body.map((bodyItem) => ({
          ...bodyItem,
          text: value,
        })),
      }))
    } else {
      setEditedWorksheet((prevState: IWorksheet) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const [editWorksheetInfo, { loading }] = useMutation(UPDATE_WORKSHEET, {
    variables: {
      id: editedWorksheet._id,
      input: {
        title: editedWorksheet.title,
        difficulty: editedWorksheet.difficulty,
        body: editedWorksheet.body,
        levelId: topicSchoolGrade,
        topicId: topicId,
        subjectId: subjectId,
      },
    },
    onCompleted: (data) => {
      console.log(data)
      showToast('success', 'Worksheet Updated Successfully!')
      setIsSubmitting(false)
      // reload the page
    },
    onError: (error) => {
      showToast('error', error.message)
      console.log(error)
      setIsSubmitting(false)
    },
  })
  
  const handleSave = () => {
    setIsSubmitting(true)
    
    // Validate required fields
    if (!editedWorksheet.title.trim()) {
      showToast('error', 'Worksheet title is required')
      setIsSubmitting(false)
      return
    }
    
    if (!editedWorksheet.difficulty) {
      showToast('error', 'Please select a difficulty level')
      setIsSubmitting(false)
      return
    }
    
    if (editedWorksheet.body.length === 0) {
      showToast('error', 'At least one content section is required')
      setIsSubmitting(false)
      return
    }
    
    // Remove __typename field from each body item
    const bodyWithoutTypename = editedWorksheet.body.map(
      ({ __typename, ...item }) => item,
    )

    // Create a new worksheet object without __typename fields
    const worksheetToSend = { ...editedWorksheet, body: bodyWithoutTypename }

    // Then use `worksheetToSend` in your mutation
    editWorksheetInfo({
      variables: {
        id: worksheetToSend._id,
        input: {
          title: worksheetToSend.title,
          difficulty: worksheetToSend.difficulty,
          body: worksheetToSend.body,
          levelId: topicSchoolGrade,
          topicId: topicId,
          subjectId: subjectId,
        },
      },
    })
  }

  useEffect(() => {
    setEditedWorksheet(worksheet)
  }, [worksheet])

  const handleAddBodyItem = () => {
    setEditedWorksheet({
      ...editedWorksheet,
      body: [...editedWorksheet.body, { __typename: '', text: '', img: '' }],
    })
  }

  const handleRemoveBodyItem = (index: number) => {
    if (editedWorksheet.body.length <= 1) {
      showToast('error', 'At least one content section is required')
      return
    }
    
    setEditedWorksheet({
      ...editedWorksheet,
      body: editedWorksheet.body.filter((_, i) => i !== index),
    })
  }

  const handleBodyItemChange = (
    index: number,
    field: 'text' | 'img',
    value: string,
  ) => {
    setEditedWorksheet({
      ...editedWorksheet,
      body: editedWorksheet.body.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    })
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Image size must be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Please select a valid image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        handleBodyItemChange(index, 'img', reader.result?.toString() || '')
      }
      reader.readAsDataURL(file)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HARD': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '🟢'
      case 'MEDIUM': return '🟡'
      case 'HARD': return '🔴'
      default: return '⚪'
    }
  }

  // Show loading state while fetching learning data
  if (fetchLearningLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading worksheet data...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">Unable to load worksheet data. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <PencilIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Worksheet</h2>
              <p className="text-sm text-gray-500">Update worksheet content and settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(editedWorksheet.difficulty)}`}>
              <span className="mr-1">{getDifficultyIcon(editedWorksheet.difficulty)}</span>
              {editedWorksheet.difficulty || 'Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-8">
        <nav className="flex space-x-8">
          {[
            { id: 'basic', name: 'Basic Info', icon: DocumentTextIcon },
            { id: 'content', name: 'Content', icon: AcademicCapIcon },
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Worksheet Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={editedWorksheet.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter worksheet title"
              />
            </div>

            {/* Grade and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  School Grade
                </label>
                <select
                  value={topicSchoolGrade}
                  onChange={(e) => setTopicSchoolGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select grade</option>
                  {data && data.fetchLearning && data.fetchLearning.length > 0 ? (
                    data.fetchLearning.map((stage: any) => (
                      <option key={stage._id} value={stage._id}>
                        {stage.year}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {fetchLearningLoading ? 'Loading grades...' : 'No grades available'}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={editedWorksheet.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select difficulty</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-gray-900">{editedWorksheet.title || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDifficultyColor(editedWorksheet.difficulty)}`}>
                    {getDifficultyIcon(editedWorksheet.difficulty)} {editedWorksheet.difficulty || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Content Sections:</span>
                  <p className="text-gray-900">{editedWorksheet.body.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Content Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Worksheet Content</h3>
                <p className="text-sm text-gray-500">Add and edit content sections for your worksheet</p>
              </div>
              <button
                type="button"
                onClick={handleAddBodyItem}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {editedWorksheet.body.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                      </div>
                      <h4 className="text-md font-medium text-gray-900">Section {index + 1}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBodyItem(index)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                      disabled={editedWorksheet.body.length <= 1}
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-300 rounded-lg">
                        <ReactQuill
                          value={item.text}
                          onChange={(content, delta, source, editor) =>
                            handleBodyItemChange(index, 'text', editor.getHTML())
                          }
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Image
                      </label>
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)}
                            className="hidden"
                            id={`img-${index}`}
                          />
                          <label htmlFor={`img-${index}`} className="cursor-pointer">
                            <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              {item.img ? 'Click to change image' : 'Click to upload image'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                          </label>
                        </div>
                        
                        {item.img && (
                          <div className="relative">
                            <img
                              src={item.img}
                              alt={`Section ${index + 1} preview`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleBodyItemChange(index, 'img', '')}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editedWorksheet.body.length === 0 && (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Sections</h3>
                <p className="text-gray-500 mb-4">Add your first content section to get started</p>
                <button
                  type="button"
                  onClick={handleAddBodyItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add First Section</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {editedWorksheet.body.length} content section{editedWorksheet.body.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={isSubmitting || loading}
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>Update Worksheet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditWorksheet
