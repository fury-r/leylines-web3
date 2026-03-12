import { faCircle, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios'
import Image from 'next/image'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import toast, { Toaster } from 'react-hot-toast'
import { logger } from '../../../utils/logger'

const Chat = () => {
  const [data, setData] = useState({
    data: [],
    mode: 0
  })
  const [search, setSearch] = useState([])
  useEffect(() => {
    handleGetConversations()
  }, [])

  const handleGetConversations = () => {
    axios
      .get('/v1/open-conversations')
      .then((res) => {
        logger.info('Loaded conversations', { count: res.data?.data?.length || 0 })
        setData(res.data)
      })
      .catch((e) => {
        logger.error('Failed to load conversations', e?.response?.data || e)
      })
  }
  const handleSearch = (e) => {
    const search = e.target.value
    if (e.target.value.length === 0) {
      setSearch([])
    }
    axios
      .post('/v1/search', {
        search
      })
      .then((res) => {
        if (res.data.length === 0) {
          toast.success('Nothing found')
        }
        setSearch(res.data)
      })
      .catch((e) => {
        logger.error('Failed to search conversations', e)
      })
  }

  const openConversation = (e) => {
    Router.push('/private/chat/conversation/' + e)
  }

  return (
    <div className='flex flex-1 flex-col bg-slate-100 min-h-screen'>
      <Toaster />
      <div className='mx-5 mt-1 flex h-full flex-col'>
        <div className='m-2 flex  flex-col'>
          <div className='rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>
              Messages
            </p>
            <h1 className='mt-2 text-3xl font-semibold'>Direct inbox</h1>
            <p className='mt-2 text-sm text-slate-300'>
              Search for people or jump back into an encrypted conversation.
            </p>
          </div>
          <div className='mt-4 flex flex-row justify-center'>
            <div className='flex w-5/6 flex-row items-center rounded-3xl border-grey bg-white px-3 shadow-md'>
              <input
                className='h-16 w-full text-xl outline-none'
                type='text'
                name='search'
                onChange={handleSearch}
                placeholder='Search by username'
              />
              <FontAwesomeIcon
                className='text-2xl text-gray-400'
                icon={faSearch}
              />
            </div>
          </div>
          <ul>
            {search.length > 0 ? (
              search.map((value, key) => (
                <button
                  onClick={() => {
                    openConversation(search[key].username)
                  }}
                  key={key}
                  className='mt-3 flex h-30 w-full flex-row items-center justify-between rounded-2xl bg-white p-3 py-2 text-left shadow-md focus:outline-none focus-visible:bg-indigo-50'
                >
                  <div
                    className={
                      'flex flex-row items-center justify-center rounded-full bg-slate-300 hover:shadow-md ' +
                      (value?.image ? '' : 'p-5')
                    }
                  >
                    {value?.img ? (
                      <Image
                        src={`data:image/${value.type};base64,${value.image}`}
                        alt='myimage'
                        width={60}
                        height={60}
                        className='rounded-full'
                      />
                    ) : (
                      <FontAwesomeIcon
                        color='black'
                        icon={faUser}
                        className='w-  text-xl text-gray-500'
                      />
                    )}
                  </div>
                  <div>
                    <h4 className='text-2xl font-semibold text-gray-900'>
                      {value.username}
                    </h4>
                    {data.mode === 1 ? (
                      <div className='text-[13px]'>
                        {value?.unseen > 0
                          ? value.unseen +
                            ' new ' +
                            (value.unseen > 1 ? 'messages' : 'message')
                          : value.msg}
                      </div>
                    ) : null}
                  </div>
                </button>
              ))
            ) : null}
          </ul>
        </div>
        {data.data.length > 0 && search.length === 0 ? (
          data.data.map((value, key) => (
            <button
              onClick={() => {
                openConversation(data.data[key].username)
              }}
              key={key}
              className='my-2 flex h-30 w-full flex-row items-center justify-between rounded-3xl bg-white p-3 py-2 text-left shadow-md focus:outline-none focus-visible:bg-indigo-50'
            >
              <div className='flex flex-row items-center justify-center'>
                <div
                  className={
                    ' rounded-full bg-slate-300 hover:shadow-md ' +
                    (value?.image ? '' : 'p-5')
                  }
                >
                  {value?.img ? (
                    <Image
                      src={`data:image/${value.type};base64,${value.image}`}
                      alt='myimage'
                      width={60}
                      height={60}
                      className='rounded-full'
                    />
                  ) : (
                    <FontAwesomeIcon
                      color='black'
                      icon={faUser}
                      className='w-  text-xl text-gray-500'
                    />
                  )}
                  <FontAwesomeIcon
                    className={
                      '  rounded-full  ' +
                      (value.active
                        ? 'bg-green-500 text-green-500'
                        : 'text-grey-500 bg-gray-500')
                    }
                    icon={faCircle}
                  />
                </div>
                <h4 className='m-2 text-2xl font-semibold text-gray-900'>
                  {value.username}
                </h4>
              </div>

              <div>
                <label className='text-xl text-gray-500 mb-2'>
                  {value.time}
                </label>

                {data.mode === 1 ? (
                  <div className='mr text-2xl'>
                    {value.unseen > 0
                      ? value.unseen +
                        ' new ' +
                        (value.unseen > 1 ? 'messages' : 'message')
                      : 'Last message: ' + value.msg}
                  </div>
                ) : null}
              </div>
            </button>
          ))
        ) : search.length === 0 ? (
          <div className='mt-10 flex flex-col justify-center self-center overflow-hidden rounded-3xl bg-white px-8 py-10 text-center shadow-sm'>
            <label className='text-xl font-semibold text-slate-900'>
              No open conversations
            </label>
            <p className='mt-2 text-sm text-slate-500'>
              Search for a user to start a new secure chat.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default Chat
