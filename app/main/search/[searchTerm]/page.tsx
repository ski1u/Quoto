import React from 'react'

const SearchPage = async ({ params } : {
    params : { searchTerm: string }
}) => {
    const { searchTerm } = await params

  return (
    <div>SearchPage</div>
  )
}

export default SearchPage