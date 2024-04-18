import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { STUDENTS } from '@/apollo/queries/dashboard';
import AppLayout from '@/layout/AppLayout';
import { statData } from '@/utils/nav';

export default function Score() {
  const { data } = useQuery(STUDENTS);
  const students = data?.students.data || [];
  const [currentScores, setCurrentScores] = useState(statData.map(stat => 0));

  useEffect(() => {  
    const incrementScores = () => {
      const newScores = currentScores.map((score, index) => {
        const targetScore = statData[index].score;
        let step = 0
        step++
        const newScore = score + step;
        return newScore >= targetScore ? targetScore : newScore; 
      });

      setCurrentScores(newScores);
      if (newScores.some((score, index) => score < statData[index].score)) {
        requestAnimationFrame(incrementScores);
      }
    };
  
    incrementScores();
  
  }, [currentScores]);
    

  const totalScore = currentScores.reduce((sum, score) => sum + score, 0);

  const circleWidth = 200;
  const radius = 90;
  const statArray = radius * Math.PI * 2;
  const estimatedPercentage = (totalScore / (statData.length * 100)) * 100;
  const statOffset = statArray - (statArray * estimatedPercentage) / 100;

  const subjectRadius = 65;
  const subjectStatArray = subjectRadius * Math.PI * 2;
  const subjectOffsets = statData.map((stat, index) => {
    const subjectStatOffset = subjectStatArray - (subjectStatArray * currentScores[index]) / 100;
    return subjectStatOffset;
  });

  return (
    <AppLayout>
      <div className='grid justify-items-stretch'>
        <div className='w-full px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-md justify-self-center'>
          <h1 className="font-bold text-lg">Scores</h1>
          <section className='flex w-full justify-between my-4'>
            <select className='border border-black rounded-md w-60 py-4 px-2'>
              {students.map((student: any) => (
                <option key={student} value={student.name} className='font-bold'>{student.name}</option>
              ))}
            </select>
          </section>

          <section className='font-bold grid md:flex gap-x-32'>
            <section className=''> 
              <p className='text-lg my-2'>Overall score</p>
              <div className='border p-8 flex flex-col justify-center items-center space-y-6'>

                <svg 
                  width={circleWidth}
                  height={circleWidth}
                  viewBox={`0 0 ${circleWidth} ${circleWidth}`}
                >
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth= '15px'
                    r={radius}
                    className='circle-background mb-10'
                  />
                  <circle
                    cx={circleWidth / 2}
                    cy={circleWidth / 2}
                    strokeWidth= '15px'
                    r={radius}
                    className='circle-progress'
                    style={{
                      strokeDasharray : statArray,
                      strokeDashoffset : statOffset,
                    }}
                    transform = {`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                  />
                  <text
                    x='50%'
                    y='50%'
                    dy='0.3em'
                    textAnchor= 'middle'
                    className='circle-text'
                  >
                    {estimatedPercentage.toFixed(2)}%
                  </text>
                </svg>

                <div className=''>
                  <table>
                    <thead>
                      <tr>
                        <th className='w-full flex justify-center'><p className='bg-yellow-500 p-2 w-5/6'>Activities completed</p></th>
                      </tr>
                    </thead>
                    <tbody className='text-center'>
                      <tr>
                        <td>{totalScore}</td>
                      </tr>
                    </tbody>    
                  </table>
                </div>
              </div>
            </section>

            <section className=''> 
              <p className='text-lg my-2'>Subject score</p>
              <div className='w-full md:w-[50vw] border p-6 grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-x-10'>
                {statData.map((stat, index) => (
                  <div key={index} className='w-full grid justify-center'>
                    <div className='w-full flex justify-center'><p className='bg-green-500 text-white text-center p-2 w-5/6'>{stat.subject}</p></div>
                    <svg 
                      width={circleWidth}
                      height={circleWidth}
                      viewBox={`0 0 ${circleWidth} ${circleWidth}`}>
                        <circle
                          cx={circleWidth / 2}
                          cy={circleWidth / 2}
                          strokeWidth= '15px'
                          r={subjectRadius}
                          className='circle-background'
                        />
                        <circle
                          cx={circleWidth / 2}
                          cy={circleWidth / 2}
                          strokeWidth= '15px'
                          r={subjectRadius}
                          className='circle-progress'
                          style={{
                            strokeDasharray : subjectStatArray,
                            strokeDashoffset : subjectOffsets[index],
                          }}
                          transform = {`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
                        />
                        <text
                          x='50%'
                          y='50%'
                          dy='0.3em'
                          textAnchor= 'middle'
                          className='circle-text'
                        >
                          {currentScores[index]}
                        </text>
                    </svg>
                    <div className='w-full flex justify-center'>
                      <table>
                        <thead>
                          <tr>
                          <th className='w-full flex justify-center'><p className='bg-green-500 text-white p-2 w-5/6'>Activities completed</p></th>
                          </tr>
                        </thead>
                        <tbody className='text-center w-full border-b h-10 mb-4'>
                          <tr>
                            <td>{currentScores[index]}</td>
                          </tr>
                        </tbody>    
                      </table>
                    </div>
                  </div>
                ))}

              </div>
            </section>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
