// @ts-nocheck
'use client'

import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from '@/hooks/use-toast';

const CallList = ({ type }: { type: 'ended'|'upcoming'|'recordings'}) => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const { toast } = useToast()

  const getCalls = () => {
    switch (type) {
      case 'ended' : 
      return endedCalls;
      case 'recordings': 
      return recordings;
      case 'upcoming': 
      return upcomingCalls;
      default: return []
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended' : 
      return 'No previous Calls';
      case 'recordings': 
      return 'No Recordings';
      case 'upcoming': 
      return "No upcoming Calls";
      default: return ''
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
        callRecordings.map(meeting => meeting.queryRecordings())
      )

      const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);

      setRecordings(recordings);
      } catch (error) {
        toast({ title: 'Too many request. Try again later'})
      }
    }

    if (type === 'recordings') fetchRecordings();

  }, [type, callRecordings])

  if (isLoading) return <Loader />

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
        <MeetingCard 
          key={(meeting as Call)?.id}
          icon={
            type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : 
            '/icons/recordings.svg'
          }
          title={(meeting as Call).state?.custom?.description?.substring(0, 25) || meeting?.filename?.substring || 'No description'}
          date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
          isPreviousMeeting={
            type === 'ended'
          }
          buttonIcon={
            type === 'recordings' ? '/icons/play.svg' : undefined
          }
          buttonText={
            type === 'recordings' ? 'Play' : 'Start'
          }
          link={
            type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
          }
          handleClick={
            type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`meeting/${meeting.id}`)
          }
          />
        // http://localhost:3000/meeting/3c9f26cc-0db6-4612-bd63-92d49fd9581c
      )) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList