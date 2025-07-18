/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'
import { 
  PlusIcon, 
  TrashIcon, 
  EyeIcon, 
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminLayout from '@/layout/AdminLayout'

import { CREATE_WORKSHEET } from '@/apollo/mutations/admin'
import { FETCH_LEARNING } from '@/apollo/queries/dashboard'
import ModalAuth from '@/components/ModalComp'
import { SCHOOL_GRADES } from '@/apollo/queries/admin'

// Enhanced toolbar options for better content creation
const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }], // Headers
  ['bold', 'italic', 'underline'], // Basic formatting
  [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
  [{ 'align': [] }], // Alignment
  ['link', 'image'], // Links and images
  ['clean'] // Remove formatting
];

// Worksheet templates for different types
const worksheetTemplates = {
  'basic': {
    name: 'Basic Worksheet',
    description: 'Simple text-based worksheet with questions',
    sections: [
      { title: 'Introduction', content: 'Start with a brief introduction to the topic...' },
      { title: 'Main Content', content: 'Add your main content here...' },
      { title: 'Questions', content: 'Add questions for students to answer...' }
    ]
  },
  'interactive': {
    name: 'Interactive Worksheet',
    description: 'Worksheet with multimedia content and activities',
    sections: [
      { title: 'Video Introduction', content: 'Add a video to introduce the topic...' },
      { title: 'Interactive Content', content: 'Add engaging content with images...' },
      { title: 'Practice Activities', content: 'Add hands-on activities...' },
      { title: 'Assessment', content: 'Add questions to test understanding...' }
    ]
  },
  'assessment': {
    name: 'Assessment Worksheet',
    description: 'Focused on testing knowledge and understanding',
    sections: [
      { title: 'Instructions', content: 'Clear instructions for students...' },
      { title: 'Multiple Choice Questions', content: 'Add multiple choice questions...' },
      { title: 'Short Answer Questions', content: 'Add short answer questions...' },
      { title: 'Essay Questions', content: 'Add longer essay questions...' }
    ]
  }
};

// Custom styles for better typography
const previewStyles = `
  .preview-content {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .preview-content h1, .preview-content h2, .preview-content h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .preview-content h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  .preview-content h2 {
    font-size: 2rem;
    margin-bottom: 1.25rem;
  }
  
  .preview-content h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .preview-content p {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 1rem;
    color: #374151;
  }
  
  .preview-content ul, .preview-content ol {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .preview-content li {
    margin-bottom: 0.5rem;
  }
  
  .preview-content strong {
    font-weight: 600;
    color: #111827;
  }
  
  .preview-content a {
    color: #2563eb;
    text-decoration: underline;
    font-weight: 500;
  }
  
  .preview-content a:hover {
    color: #1d4ed8;
  }
  
  .preview-content blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #6b7280;
  }
  
  .preview-content code {
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
  }
  
  .preview-content pre {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  
  .preview-content pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
`;

export default function Create() {
  const path = useRouter()
  const uploadRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [video, setVideo] = useState('')
  const [bodyItems, setBodyItems] = useState([{ text: '', img: '', sectionTitle: 'Introduction' }])
  const [topicSchoolGrade, setTopicSchoolGrade] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [estimatedTime, setEstimatedTime] = useState('')
  const [learningObjectives, setLearningObjectives] = useState('')
  
  let subjectId: string | null = null
  let topicId: string | null = null
  if (typeof window !== 'undefined') {
    subjectId = localStorage.getItem('subjectId')
    topicId = localStorage.getItem('topicId')
  }

  const { data } = useQuery(SCHOOL_GRADES)

  const [createWorksheet, { loading }] = useMutation(CREATE_WORKSHEET, {
    onCompleted: (data) => {
      console.log(data)
      toast.success('Worksheet created successfully! 🎉')
      setTimeout(() => {
        if (subjectId) {
          path.push(`/admin/subjects/topics/worksheets/${topicId}`)
        }
      }, 2000)
    },
    onError: (error) => {
      toast.error('Error creating worksheet: ' + error.message)
    },
  })

  const handleAddBodyItem = useCallback(() => {
    setBodyItems(prev => [...prev, { text: '', img: '', sectionTitle: `Section ${prev.length + 1}` }])
  }, [])

  const handleRemoveBodyItem = useCallback((index: number) => {
    setBodyItems(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index)
      } else {
        toast.warning('You need at least one section')
        return prev
      }
    })
  }, [])

  const handleBodyItemChange = useCallback((
    index: number,
    field: string,
    value: string,
  ) => {
    setBodyItems(prev => 
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      )
    )
  }, [])

  const createMarkup = useCallback((htmlString: string) => {
    return { __html: htmlString };
  }, []);

  const handleFileChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        handleBodyItemChange(index, 'img', reader.result?.toString() || '')
        toast.success('Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }, [handleBodyItemChange])

  const applyTemplate = useCallback((templateKey: string) => {
    const template = worksheetTemplates[templateKey as keyof typeof worksheetTemplates]
    if (template) {
      setBodyItems(template.sections.map(section => ({
        text: section.content,
        img: '',
        sectionTitle: section.title
      })))
      setSelectedTemplate(templateKey)
      setShowTemplates(false)
      toast.success(`Applied ${template.name} template!`)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Enhanced validation with better user feedback
    const errors = []
    
    if (title.trim() === '') {
      errors.push('Worksheet title is required')
    }
    if (topicSchoolGrade === '') {
      errors.push('Please select a school grade')
    }
    if (difficulty === '') {
      errors.push('Please select difficulty level')
    }
    if (bodyItems.some(item => item.text.trim() === '')) {
      errors.push('All content sections must have text')
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    // Filter out sectionTitle field from bodyItems to match BodyInput schema
    const filteredBody = bodyItems.map(({ text, img }) => ({ text, img }))

    createWorksheet({
      variables: {
        title: title,
        body: filteredBody,
        levelId: topicSchoolGrade,
        topicId: topicId,
        subjectId: subjectId,
        difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        vidLink: video
      }
    })
  }, [title, topicSchoolGrade, difficulty, bodyItems, createWorksheet, topicId, subjectId, video])

  const getDifficultyColor = useCallback((diff: string) => {
    switch (diff) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getProgressPercentage = useCallback(() => {
    let completed = 0
    if (title.trim()) completed++
    if (topicSchoolGrade) completed++
    if (difficulty) completed++
    if (bodyItems.some(item => item.text.trim())) completed++
    return (completed / 4) * 100
  }, [title, topicSchoolGrade, difficulty, bodyItems])

  // Create stable onChange handlers for each ReactQuill instance
  const quillChangeHandlers = useMemo(() => {
    return bodyItems.map((_, index) => 
      (content: string, delta: any, source: any, editor: any) => {
        handleBodyItemChange(index, 'text', editor.getHTML())
      }
    )
  }, [bodyItems.length, handleBodyItemChange])

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => path.back()}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <IoIosArrowBack className="h-5 w-5 mr-2" />
                  Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Worksheet</h1>
                  <p className="text-sm text-gray-600">Design engaging educational content for students</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {Math.round(getProgressPercentage())}% Complete
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-6">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Worksheet Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title for your worksheet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-1 text-sm text-gray-500">Make it clear and engaging for students</p>
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="grade"
                    value={topicSchoolGrade}
                    onChange={(e) => setTopicSchoolGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select grade level</option>
                    {data?.schoolGrades?.data?.map((stage: any) => (
                      <option key={stage._id} value={stage._id}>
                        {stage.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select difficulty</option>
                    <option value="EASY">Easy - Suitable for beginners</option>
                    <option value="MEDIUM">Medium - Moderate challenge</option>
                    <option value="HARD">Hard - Advanced level</option>
                  </select>
                  {difficulty && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion Time
                  </label>
                  <input
                    id="estimatedTime"
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g., 30 minutes, 1 hour"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <textarea
                  id="objectives"
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="What will students learn from this worksheet? (Optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Templates Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Worksheet Templates</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showTemplates ? 'Hide Templates' : 'Show Templates'}
                </button>
              </div>

              {showTemplates && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(worksheetTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => applyTemplate(key)}
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.sections.length} sections
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Content Sections</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddBodyItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {bodyItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.sectionTitle}
                          onChange={(e) => handleBodyItemChange(index, 'sectionTitle', e.target.value)}
                          placeholder="Section title"
                          className="text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                        />
                      </div>
                      {bodyItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBodyItem(index)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Text Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-300 rounded-lg">
                          <ReactQuill
                            value={item.text}
                            modules={{ toolbar: toolbarOptions }}
                            formats={[
                              'header', 'bold', 'italic', 'underline',
                              'list', 'bullet', 'link', 'image', 'align'
                            ]}
                            onChange={quillChangeHandlers[index]}
                            placeholder="Write your content here..."
                            className="min-h-[200px]"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Use the toolbar above to format your text, add links, or insert images
                        </p>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {item.img ? (
                            <div className="space-y-4">
                              <img 
                                src={item.img} 
                                alt="Section content" 
                                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleBodyItemChange(index, 'img', '')}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove Image
                              </button>
                            </div>
                          ) : (
                            <div>
                              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4">
                                <button
                                  type="button"
                                  onClick={() => uploadRef.current?.click()}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  <PhotoIcon className="h-4 w-4 mr-2" />
                                  Upload Image
                                </button>
                                <p className="mt-2 text-xs text-gray-500">
                                  PNG, JPG up to 5MB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          ref={uploadRef}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-6">
                <VideoCameraIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Video Content (Optional)</h2>
              </div>
              
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                  Video Embed Code
                </label>
                <textarea
                  id="video"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="Paste your video embed code here (YouTube, Vimeo, etc.)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div className="mt-2 text-sm text-gray-500">
                  <p>• Copy the embed code from YouTube, Vimeo, or other video platforms</p>
                  <p>• Make sure the width and height are less than 500px for best display</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => path.back()}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Create Worksheet
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        <ModalAuth
          isOpen={open}
          XIcon={true}
          onClose={() => setOpen(false)}
          styling={'!w-[95vw] !max-w-[1800px] m-auto'}
        >
          <style jsx>{`
            .preview-content {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .preview-content h1, .preview-content h2, .preview-content h3 {
              font-family: 'Playfair Display', Georgia, serif;
              font-weight: 700;
              line-height: 1.2;
            }
            
            .preview-content h1 {
              font-size: 2.5rem;
              margin-bottom: 1.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .preview-content h2 {
              font-size: 2rem;
              margin-bottom: 1.25rem;
              color: #1f2937;
            }
            
            .preview-content h3 {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              color: #374151;
            }
            
            .preview-content p {
              font-size: 1.125rem;
              line-height: 1.8;
              margin-bottom: 1.25rem;
              color: #4b5563;
            }
            
            .preview-content ul, .preview-content ol {
              font-size: 1.125rem;
              line-height: 1.8;
              margin-bottom: 1.25rem;
              padding-left: 1.75rem;
            }
            
            .preview-content li {
              margin-bottom: 0.75rem;
              position: relative;
            }
            
            .preview-content ul li::before {
              content: '•';
              color: #3b82f6;
              font-weight: bold;
              position: absolute;
              left: -1.25rem;
            }
            
            .preview-content ol li::before {
              content: counter(list-item) '.';
              color: #3b82f6;
              font-weight: bold;
              position: absolute;
              left: -1.5rem;
            }
            
            .preview-content strong {
              font-weight: 600;
              color: #111827;
              background: linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%);
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
            }
            
            .preview-content a {
              color: #2563eb;
              text-decoration: none;
              font-weight: 500;
              border-bottom: 2px solid #dbeafe;
              transition: all 0.2s ease;
            }
            
            .preview-content a:hover {
              color: #1d4ed8;
              border-bottom-color: #3b82f6;
            }
            
            .preview-content blockquote {
              border-left: 4px solid #3b82f6;
              padding: 1rem 1.5rem;
              margin: 2rem 0;
              font-style: italic;
              color: #6b7280;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-radius: 0 0.5rem 0.5rem 0;
            }
            
            .preview-content code {
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              padding: 0.25rem 0.5rem;
              border-radius: 0.375rem;
              font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
              font-size: 0.875rem;
              border: 1px solid #d1d5db;
            }
            
            .preview-content pre {
              background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
              color: #f9fafb;
              padding: 1.5rem;
              border-radius: 0.75rem;
              overflow-x: auto;
              margin: 2rem 0;
              border: 1px solid #374151;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .preview-content pre code {
              background: transparent;
              padding: 0;
              color: inherit;
              border: none;
            }
            
            .preview-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
              border-radius: 0.5rem;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .preview-content th {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 1rem;
              text-align: left;
              font-weight: 600;
            }
            
            .preview-content td {
              padding: 1rem;
              border-bottom: 1px solid #e5e7eb;
              background: white;
            }
            
            .preview-content tr:nth-child(even) td {
              background: #f9fafb;
            }
            
            /* Print styles */
            @media print {
              .preview-content {
                font-size: 12pt;
                line-height: 1.4;
              }
              
              .preview-content h1 {
                font-size: 18pt;
                page-break-after: avoid;
                -webkit-text-fill-color: black;
              }
              
              .preview-content h2 {
                font-size: 16pt;
                page-break-after: avoid;
              }
              
              .preview-content h3 {
                font-size: 14pt;
                page-break-after: avoid;
              }
              
              .preview-content p {
                font-size: 12pt;
                margin-bottom: 0.5rem;
              }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
              .preview-content h1 {
                font-size: 2rem;
              }
              
              .preview-content h2 {
                font-size: 1.75rem;
              }
              
              .preview-content h3 {
                font-size: 1.25rem;
              }
              
              .preview-content p {
                font-size: 1rem;
              }
            }
            
            /* Animation classes */
            .fade-in {
              animation: fadeIn 0.6s ease-in-out;
            }
            
            .slide-up {
              animation: slideUp 0.8s ease-out;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .section-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .section-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          
          <div className="max-h-[92vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            {/* Enhanced Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 shadow-2xl z-10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([document.querySelector('.preview-content')?.innerHTML || ''], {type: 'text/html'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${title || 'worksheet'}.html`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                  <button
                    onClick={() => {
                      const modal = document.querySelector('[role="dialog"]');
                      if (modal) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          modal.requestFullscreen();
                        }
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Fullscreen
                  </button>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-white/90 font-medium">Live Preview</p>
                  </div>
                  <p className="text-xs text-white/70">Professional Educational Platform</p>
                </div>
              </div>
              
              <div className="text-center fade-in">
                <h1 className="text-6xl font-bold mb-6 font-serif tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {title || 'Worksheet Preview'}
                </h1>
                <div className="flex items-center justify-center space-x-8 text-sm">
                  {difficulty && (
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                      difficulty === 'EASY' ? 'bg-green-100/20 text-green-100 border border-green-300/30' :
                      difficulty === 'MEDIUM' ? 'bg-yellow-100/20 text-yellow-100 border border-yellow-300/30' :
                      'bg-red-100/20 text-red-100 border border-red-300/30'
                    }`}>
                      {difficulty}
                    </span>
                  )}
                  {estimatedTime && (
                    <span className="flex items-center text-white/95 font-medium bg-white/10 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {estimatedTime}
                    </span>
                  )}
                  {topicSchoolGrade && (
                    <span className="flex items-center text-white/95 font-medium bg-white/10 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Grade {data?.schoolGrades?.data?.find((grade: any) => grade._id === topicSchoolGrade)?.year || 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-12 max-w-6xl mx-auto">
              {learningObjectives && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 rounded-2xl p-10 mb-12 shadow-xl slide-up">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-6">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-4 font-serif">Learning Objectives</h3>
                      <p className="text-blue-800 leading-relaxed text-lg font-medium">{learningObjectives}</p>
                    </div>
                  </div>
                </div>
              )}

              {video && (
                <div className="mb-12 slide-up">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-serif">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-4">
                        <VideoCameraIcon className="h-6 w-6 text-white" />
                      </div>
                      Video Content
                    </h3>
                    <div className="mx-auto max-w-5xl" dangerouslySetInnerHTML={createMarkup(video)} />
                  </div>
                </div>
              )}

              <div className="space-y-12">
                {bodyItems.map((item, index) => (
                  <div key={index} className="section-card bg-white border border-gray-200 rounded-3xl p-12 shadow-xl slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center mb-10">
                      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-2xl w-16 h-16 flex items-center justify-center font-bold text-xl mr-8 shadow-2xl">
                        {index + 1}
                      </div>
                      <h3 className="text-4xl font-bold text-gray-900 font-serif">
                        {item.sectionTitle || `Section ${index + 1}`}
                      </h3>
                    </div>
                    
                    {item.text && (
                      <div className="mb-10">
                        <div
                          className="preview-content"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                      </div>
                    )}
                    
                    {item.img && (
                      <div className="flex justify-center mb-8">
                        <div className="relative group">
                          <img
                            src={item.img}
                            alt="Section content"
                            className="max-w-full h-auto max-h-[600px] rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            Click to enlarge
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Footer */}
              <div className="mt-20 pt-12 border-t-2 border-gray-200 slide-up">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl mr-4 shadow-lg"></div>
                    <h3 className="text-3xl font-bold text-gray-900 font-serif">Edcenta</h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-3">Professional Educational Platform</p>
                  <p className="text-base text-gray-600 mb-6">Designed for optimal learning experience</p>
                  
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="text-2xl mr-2">📚</span>
                      Quality Education
                    </span>
                    <span className="flex items-center">
                      <span className="text-2xl mr-2">🎯</span>
                      Interactive Learning
                    </span>
                    <span className="flex items-center">
                      <span className="text-2xl mr-2">📊</span>
                      Progress Tracking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalAuth>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AdminLayout>
  )
}
