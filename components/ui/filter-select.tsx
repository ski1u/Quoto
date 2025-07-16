import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const FilterSelect = ({ state, setState } : {
    state: any
    setState: any
}) => {
  return (
    <div className='w-screen justify-center flex'>
      <div className='w-2/3'>
      <Select value={state} onValueChange={setState} defaultValue="">
        <SelectTrigger className='w-fit'><SelectValue placeholder="Filter" /></SelectTrigger>

        <SelectContent>
          <SelectItem value='most_liked'>Most Liked</SelectItem>
          <SelectItem value='latest'>Latest</SelectItem>
          <SelectItem value='oldest'>Oldest</SelectItem>
        </SelectContent>
      </Select>
      </div>
    </div>
  )
}

export default FilterSelect