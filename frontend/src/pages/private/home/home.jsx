import React from 'react'
import axios from '../../../api/axios'
import Posts from '../../../components/Posts'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/authContext'
import { Oval } from 'react-loader-spinner'
import { logger } from '../../../utils/logger'

const Home = () => {
  const [data, setData] = useState([])
  const { currentAccount } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getContent()
  }, [])
  const getContent = async () => {
    await setLoading(true)
    await axios
      .get('/v1/get-content')
      .then((res) => {
        logger.info('Loaded home feed', { count: res.data?.length || 0 })
        setData(res.data)
      })
      .catch((er) => {
        logger.error('Failed to load home feed', er)
      })
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='mx-4 mt-2 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 p-5 text-white shadow-lg'>
        <p className='text-sm uppercase tracking-[0.3em] text-pink-100'>
          Social feed
        </p>
        <h1 className='mt-2 text-3xl font-semibold'>Your Leylines timeline</h1>
        <p className='mt-2 max-w-2xl text-sm text-pink-50'>
          Catch up with your network, explore recent posts, and keep your
          wallet-connected identity active.
        </p>
        {currentAccount ? (
          <p className='mt-3 text-xs text-pink-100'>
            Wallet connected: {currentAccount}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className='flex flex-1 flex-col justify-center items-center min-h-screen'>
          <Oval
            height={50}
            width={50}
            color='black'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='black'
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      ) : data.length === 0 ? (
        <div className='m-4 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm'>
          <h2 className='text-2xl font-semibold text-slate-900'>
            Your feed is quiet right now
          </h2>
          <p className='mt-3 text-base text-slate-500'>
            Follow more creators or upload your first post to start building an
            Instagram-style timeline.
          </p>
        </div>
      ) : (
        <div className='m-4 flex flex-col justify-center items-center'>
          <Posts
            setData={setData}
            data={data}
            handleChange={getContent}
            mode={0}
          />
        </div>
      )}
    </div>
  )
}

export default Home
