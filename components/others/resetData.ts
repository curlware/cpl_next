import { resetHomepageContent } from '@/actions/data/homepage'

export const handleResetData = async () => {
  if (!window.confirm('Are you sure want to reset all data?')) return
  try {
    const result = await resetHomepageContent()
    if (result.success) {
      console.log('Data reset successfully')
    } else {
      console.error('Failed to reset data:', result.error)
    }
  } catch (error) {
    console.error('Error resetting data:', error)
  }
}
