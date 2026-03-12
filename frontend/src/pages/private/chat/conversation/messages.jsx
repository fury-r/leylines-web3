import React, { useEffect, useRef } from 'react'

const Messages = ({ styles, data, setId, setIsOpen }) => {
  const scroll = useRef()

  useEffect(() => {
    if (scroll?.current) {
      scroll?.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scroll?.current, data])
  return (
    <>
      {data.data.length > 0 ? (
        <div className=' m-5 flex  flex-col  h-4/6 max-h-screen overflow-y-auto my-20'>
          {data.data.map((value, key) => (
            <button
              key={key}
              ref={key == data.data.length - 1 ? scroll : null}
              className={styles[value.user + 2] + ' flex flex-col'}
              onClick={() => {
                if (value.user == 1) {
                  setId(data.data[key].id)
                  setIsOpen(true)
                }
              }}
            >
              <div
                className={
                  styles[value.user] +
                  ' my-4 max-w-[80%] p-4 text-xl shadow-md ' +
                  (value.msg.length > 32 ? ' w-1/2' : '')
                }
              >
                {value.msg}
              </div>
              {value.seen == true &&
              value.user == 1 &&
              key == data.data.length - 1 ? (
                <label className='flex rounded-sm p-2 text-sm uppercase tracking-[0.2em] text-slate-500 shadow-sm'>
                  seen
                </label>
              ) : (
                <></>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className='flex h-screen flex-col items-center justify-center px-6 text-center'>
          <div className='rounded-3xl bg-white p-10 shadow-sm'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
              Direct messages
            </p>
            <h2 className='mt-2 text-3xl font-semibold text-slate-900'>
              Start a conversation
            </h2>
            <p className='mt-2 max-w-md text-base text-slate-500'>
              Messages in this view are stored with encryption on the backend.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
export default Messages
