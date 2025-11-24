router.post('/:id/bookings', async (req, res) => {
    const { id } = req.params
    const { userId, startAt, endAt } = req.body
    // naive conflict check
    const conflicts = await Booking.find({ groupId: id, status: { $in: ['pending', 'approved'] }, $or: [{ startAt: { $lt: new Date(endAt) }, endAt: { $gt: new Date(startAt) } }] })
    if (conflicts.length) return res.status(409).json({ message: 'Conflict with existing booking' })
    const booking = await Booking.create({ groupId: id, userId, startAt, endAt, status: 'pending' })
    res.json(booking)
})

// Get bookings for group
router.get('/:id/bookings', async (req, res) => {
    const { id } = req.params
    const bookings = await Booking.find({ groupId: id }).sort({ startAt: 1 }).limit(200)
    res.json(bookings)
})

module.exports = router