import { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoards, createBoardAsync, updateBoardAsync, deleteBoardAsync, setCurrentBoard } from '../redux/slices/boardSlice'
import { selectAllBoards, selectCurrentBoard } from '../redux/slices/boardSlice'

/**
 * useBoard hook — provides convenient access to boards via Redux
 */
export default function useBoard() {
  const dispatch = useDispatch()
  const boards = useSelector(selectAllBoards)
  const currentBoard = useSelector(selectCurrentBoard)

  const fetchAll = useCallback(async () => {
    const res = await dispatch(fetchBoards())
    if (res?.error) throw res.error
    return res.payload
  }, [dispatch])

  const createBoard = useCallback(async (payload) => {
    const res = await dispatch(createBoardAsync(payload))
    if (res?.error) throw res.error
    return res.payload
  }, [dispatch])

  const updateBoard = useCallback(async ({ id, patch }) => {
    const res = await dispatch(updateBoardAsync({ id, patch }))
    if (res?.error) throw res.error
    return res.payload
  }, [dispatch])

  const deleteBoard = useCallback(async (id) => {
    const res = await dispatch(deleteBoardAsync(id))
    if (res?.error) throw res.error
    return res.payload
  }, [dispatch])

  const setBoard = useCallback((board) => dispatch(setCurrentBoard(board)), [dispatch])

  useEffect(()=>{ fetchAll().catch(()=>{}) }, [fetchAll])

  return {
    boards,
    currentBoard,
    fetchAll,
    createBoard,
    updateBoard,
    deleteBoard,
    setBoard,
  }
}

useBoard.propTypes = {
  // no props — exported for documentation
}
