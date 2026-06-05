import { create } from 'zustand'

const useApplicationStore = create((set) => ({
  activeProgram: null,
  activeApplication: null,

  setActiveProgram: (program) => set({ activeProgram: program }),
  setActiveApplication: (application) => set({ activeApplication: application }),
}))

export default useApplicationStore
