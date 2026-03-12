import React, { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../../api/axios'
import { Dialog, Transition } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import AccountAction from '../../../../components/AccountActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'
import Messages from './messages'
import { BiSend } from 'react-icons/bi'
import { logger } from '../../../../utils/logger'
const Conversation = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [data, setData] = useState({
    data: []
  })
  const [id, setId] = useState(0)
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (router.query.id) {
      getConversation()
    }
  }, [router.query.id])

  const getConversation = () => {
    axios
      .get('/v1/get-message?id=' + router.query.id)
      .then((res) => setData(res.data))
      .catch((err) => {
        logger.error('Failed to load conversation', err)
      })
  }
  const handlesendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim()) {
      return
    }
    await axios
      .post('/v1/send-message', {
        id: router.query.id,
        msg: text.trim()
      })
      .then((res) => {
        if (res.data?.message) {
          toast.error(res.data.message)
        } else {
          toast.success('Message sent')
        }
        setText('')
      })
      .catch((err) => {
        logger.error('Failed to send message', err)
      })
    getConversation()
  }
  const styles = {
    1: 'bg-blue-300 float-right   mx-4 my-2 p-2 rounded-lg clearfix text-right text-xl break-words',
    2: 'bg-gray-300 mx-4 my-2 p-2 rounded-lg text-left',
    3: 'items-end',
    4: 'items-start'
  }

  const handleUnsendMessage = () => {
    axios
      .get('/v1/unsend-message?id=' + id)
      .then(() => {
        setIsOpen(false)
        getConversation()
      })
      .catch((er) => {
        logger.error('Failed to unsend message', er?.response?.data || er)
      })
  }
  return (
    <div className='flex flex-col justify-between'>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 h-screen bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Unsend Message
                  </Dialog.Title>

                  <div className='mt-4 flex flex-row justify-around'>
                    <button onClick={() => handleUnsendMessage()}>Yes</button>
                    <button onClick={() => setIsOpen(false)}>No</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className='flex flex-1 flex-col'>
        <Toaster />
        <AccountAction
          showMenu={show}
          setShowMenu={setShow}
          reload={getConversation}
          data={data}
        />

        <div className=' '>
          <div className='fixed w-1/2'>
            <div className='flex flex-row items-center justify-between bg-white p-3 shadow-md'>
              <div className='flex flex-col'>
                <label className='text-xl text-black'>{data?.username}</label>
                <span className='text-xs uppercase tracking-[0.25em] text-emerald-500'>
                  Encrypted chat
                </span>
              </div>
              <button onClick={() => setShow(true)} className='text-3xl'>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
          <Messages
            data={data}
            styles={styles}
            setId={setId}
            setIsOpen={setIsOpen}
          />
          <div className='h-5/6 bg-white p-5'>
            <form className='fixed bottom-32 mb-2 flex w-2/3 flex-row items-center'>
              <textarea
                className='h-20 w-3/4 resize-none items-center rounded-xl border border-gray-300 bg-gray-200 px-4 pt-6 text-left text-2xl shadow-md'
                rows='1'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Message...'
              />
              <button
                className='mx-3 flex items-center justify-center rounded-lg bg-black p-5 text-2xl text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-400'
                onClick={handlesendMessage}
                disabled={!text.trim()}
              >
                Send <BiSend className='text-5xlxl' />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Conversation
