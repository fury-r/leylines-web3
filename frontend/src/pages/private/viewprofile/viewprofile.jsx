import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import axios from '../../../api/axios'
import ViewProfileComponent from '../../../components/ViewProfileComponent'

const Profile = () => {
  const [data, setData] = useState({
    posts: []
  })
  const router = useRouter()
  const user = router.query.id
  const [mode, setMode] = useState(1)

  useEffect(() => {
    if (router.isReady && user) {
      const nextMode = Number(router.query.mode) || 1
      setMode(nextMode)
      getProfile(nextMode)
    }
  }, [router.isReady, router.query.mode, user])

  const getProfile = (profileMode) => {
    axios
      .post('/v1/get-user-profile', {
        user,
        mode: profileMode
      })
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.log(err?.response?.data || err))
  }

  const handleViewPost = (key, postMode) => {
    if (postMode === 1) {
      Router.push({
        pathname: '/private/viewprofile/postDetails/postDetails',
        query: { id: user, mode: postMode, key: key }
      })
      return
    }

    Router.push({
      pathname: '/private/viewprofile/postDetails/nftDetails',
      query: { id: user, mode: postMode, key: key }
    })
  }

  const handleFollowUser = () => {
    axios
      .post('/v1/follow-user', {
        username: data.username,
        follow: data.follow
      })
      .catch((e) => {
        console.log(e?.response?.data || e)
      })

    getProfile(mode)
  }

  return (
    <ViewProfileComponent
      data={data}
      handleViewPost={handleViewPost}
      mode={mode}
      handleFollowUser={handleFollowUser}
      reload={getProfile}
      user={user}
      setMode={setMode}
    />
  )
}

export default Profile
