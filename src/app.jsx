import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, TrendingUp, Zap, RefreshCw, Info, ArrowRightLeft } from 'lucide-react';

const initialRooms = [
  { id: 'r1', name: 'Lab A', capacity: 30, type: 'Computer Lab', historicalUsage: 85, recentBookings: 12 },
  { id: 'r2', name: 'Lab B', capacity: 25, type: 'Computer Lab', historicalUsage: 45, recentBookings: 5 },
  { id: 'r3', name: 'Conference 1', capacity: 50, type: 'Conference Room', historicalUsage: 70, recentBookings: 9 },
  { id: 'r4', name: 'Study Room A', capacity: 15, type: 'Study Room', historicalUsage: 30, recentBookings: 3 },
  { id: 'r5', name: 'Auditorium', capacity: 200, type: 'Auditorium', historicalUsage: 55, recentBookings: 6 },
  { id: 'r6', name: 'Lab C', capacity: 28, type: 'Computer Lab', historicalUsage: 90, recentBookings: 14 }
];

const initialBookings = [
  { id: 'b1', roomId: 'r1', title: 'CS 101 Practical', attendance: 28, duration: 2, timeSlot: '09:00' },
  { id: 'b2', roomId: 'r1', title: 'Data Structures Lab', attendance: 25, duration: 3, timeSlot: '11:00' },
  { id: 'b3', roomId: 'r1', title: 'Web Dev Workshop', attendance: 30, duration: 2, timeSlot: '14:00' },
  { id: 'b4', roomId: 'r3', title: 'Faculty Meeting', attendance: 35, duration: 1, timeSlot: '10:00' },
  { id: 'b5', roomId: 'r3', title: 'Student Council', attendance: 20, duration: 2, timeSlot: '15:00' },
  { id: 'b6', roomId: 'r2', title: 'Python Bootcamp', attendance: 18, duration: 2, timeSlot: '09:00' },
  { id: 'b7', roomId: 'r5', title: 'Guest Lecture', attendance: 150, duration: 2, timeSlot: '11:00' },
  { id: 'b8', roomId: 'r6', title: 'AI Workshop', attendance: 27, duration: 3, timeSlot: '09:00' },
  { id: 'b9', roomId: 'r6', title: 'Machine Learning Lab', attendance: 26, duration: 2, timeSlot: '13:00' }
];

const calculateFairness = (room, bookings) => {
  const roomBookings = bookings.filter(b => b.roomId === room.id);
  const totalAttendance = roomBookings.reduce((sum, b) => sum + b.attendance, 0);
  const avgAttendance = roomBookings.length > 0 ? totalAttendance / roomBookings.length : 0;
  const utilizationRate = (avgAttendance / room.capacity) * 100;
  
  const historicalScore = 100 - (room.historicalUsage * 0.4);
  const bookingScore = 100 - (room.recentBookings * 3);
  const utilizationScore = utilizationRate > 80 ? 40 : (utilizationRate > 50 ? 70 : 90);
  
  const fairnessScore = (historicalScore * 0.4 + bookingScore * 0.3 + utilizationScore * 0.3);
  
  return {
    score: Math.max(0, Math.min(100, fairnessScore)),
    bookingCount: roomBookings.length,
    avgAttendance: avgAttendance.toFixed(1),
    utilization: utilizationRate.toFixed(1),
    details: {
      historicalScore: historicalScore.toFixed(1),
      bookingScore: bookingScore.toFixed(1),
      utilizationScore: utilizationScore.toFixed(1)
    }
  };
};

const getColorByScore = (score) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

const getTextColorByScore = (score) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 25) return 'text-orange-600';
  return 'text-red-600';
};

const BookingCard = ({ booking, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(booking.id)}
      className={`p-3 rounded-lg border-2 cursor-pointer shadow-sm hover:shadow-md transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-blue-200 bg-white hover:border-blue-400'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-semibold text-sm text-gray-800">{booking.title}</span>
        <span className="text-xs text-gray-500">{booking.timeSlot}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Users className="w-3 h-3" />
        <span>{booking.attendance} attendees</span>
        <span className="ml-auto">{booking.duration}h</span>
      </div>
    </div>
  );
};

const RoomCard = ({ room, fairness, bookings, selectedBooking, onSelectBooking, onMoveBooking }) => {
  const roomBookings = bookings.filter(b => b.roomId === room.id);
  const canMoveHere = selectedBooking && selectedBooking.roomId !== room.id;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
          <p className="text-xs text-gray-500">{room.type} • Capacity: {room.capacity}</p>
        </div>
        <div className="relative group">
          <div className={`w-16 h-16 rounded-full ${getColorByScore(fairness.score)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {fairness.score.toFixed(0)}
          </div>
          <div className="absolute right-0 top-20 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
            <div className="font-semibold mb-2">Fairness Breakdown:</div>
            <div>Historical Usage: {fairness.details.historicalScore}/40</div>
            <div>Recent Bookings: {fairness.details.bookingScore}/30</div>
            <div>Utilization: {fairness.details.utilizationScore}/30</div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div>Avg Attendance: {fairness.avgAttendance}</div>
              <div>Utilization: {fairness.utilization}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 min-h-[100px]">
        {roomBookings.length === 0 ? (
          <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded-lg">
            {canMoveHere ? 'Click to move here' : 'No bookings'}
          </div>
        ) : (
          roomBookings.map(booking => (
            <BookingCard 
              key={booking.id} 
              booking={booking}
              isSelected={selectedBooking?.id === booking.id}
              onSelect={onSelectBooking}
            />
          ))
        )}
      </div>

      {canMoveHere && (
        <button
          onClick={() => onMoveBooking(room.id)}
          className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Move Here
        </button>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
        <span>{roomBookings.length} bookings</span>
        <span className={`font-semibold ${getTextColorByScore(fairness.score)}`}>
          {fairness.score >= 75 ? 'Fair' : fairness.score >= 50 ? 'Moderate' : 'Overused'}
        </span>
      </div>
    </div>
  );
};

export default function FairResourceOptimizer() {
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const roomFairness = useMemo(() => {
    return rooms.map(room => ({
      room,
      fairness: calculateFairness(room, bookings)
    }));
  }, [rooms, bookings]);

  const stats = useMemo(() => {
    const avgFairness = roomFairness.reduce((sum, rf) => sum + rf.fairness.score, 0) / roomFairness.length;
    const totalBookings = bookings.length;
    const avgUtilization = roomFairness.reduce((sum, rf) => sum + parseFloat(rf.fairness.utilization), 0) / roomFairness.length;
    
    return {
      avgFairness: avgFairness.toFixed(1),
      totalBookings,
      avgUtilization: avgUtilization.toFixed(1)
    };
  }, [roomFairness, bookings]);

  const roomTypeData = useMemo(() => {
    const types = {};
    rooms.forEach(room => {
      types[room.type] = (types[room.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [rooms]);

  const hourlyActivity = useMemo(() => {
    const hours = {};
    bookings.forEach(b => {
      const hour = b.timeSlot.split(':')[0];
      hours[hour] = (hours[hour] || 0) + 1;
    });
    return Object.entries(hours)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => ({ hour: `${hour}:00`, bookings: count }));
  }, [bookings]);

  const fairnessDistribution = useMemo(() => {
    return roomFairness.map(rf => ({
      name: rf.room.name,
      score: parseFloat(rf.fairness.score.toFixed(1)),
      bookings: rf.fairness.bookingCount
    }));
  }, [roomFairness]);

  const handleSelectBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setSelectedBooking(selectedBooking?.id === bookingId ? null : booking);
  };

  const handleMoveBooking = (targetRoomId) => {
    if (selectedBooking) {
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id ? { ...b, roomId: targetRoomId } : b
      ));
      setSelectedBooking(null);
    }
  };

  const autoOptimize = () => {
    const sortedByFairness = [...roomFairness].sort((a, b) => a.fairness.score - b.fairness.score);
    const overused = sortedByFairness.slice(0, 2);
    const underused = sortedByFairness.slice(-2);
    
    const newBookings = [...bookings];
    overused.forEach(({ room: overusedRoom }) => {
      const roomBookings = newBookings.filter(b => b.roomId === overusedRoom.id);
      if (roomBookings.length > 0) {
        const bookingToMove = roomBookings[0];
        const targetRoom = underused.find(({ room }) => 
          bookingToMove.attendance <= room.capacity
        );
        if (targetRoom) {
          const index = newBookings.findIndex(b => b.id === bookingToMove.id);
          newBookings[index] = { ...bookingToMove, roomId: targetRoom.room.id };
        }
      }
    });
    
    setBookings(newBookings);
    setSelectedBooking(null);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fair-Use Resource Optimizer</h1>
          <p className="text-gray-600">Balance room allocation with fairness-aware scheduling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Fairness</p>
                <p className="text-3xl font-bold text-gray-800">{stats.avgFairness}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Utilization</p>
                <p className="text-3xl font-bold text-gray-800">{stats.avgUtilization}%</p>
              </div>
              <Users className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 shadow-lg">
            <button
              onClick={autoOptimize}
              className="w-full h-full flex flex-col items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Zap className="w-10 h-10 mb-2" />
              <span className="font-semibold">Auto-Optimize</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fairness Scores</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fairnessDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Types</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">What-If Simulator</h2>
            <div className="ml-2 relative group">
              <Info className="w-5 h-5 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-8 w-72 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                Click any booking to select it, then click "Move Here" on another room to see live fairness recalculation. Hover over fairness scores for detailed breakdowns.
              </div>
            </div>
          </div>
          {selectedBooking && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-semibold">
                Selected: {selectedBooking.title} ({selectedBooking.attendance} attendees)
              </p>
              <p className="text-blue-600 text-sm">Click "Move Here" on any room to reassign this booking</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomFairness.map(({ room, fairness }) => (
            <RoomCard
              key={room.id}
              room={room}
              fairness={fairness}
              bookings={bookings}
              selectedBooking={selectedBooking}
              onSelectBooking={handleSelectBooking}
              onMoveBooking={handleMoveBooking}
            />
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Fairness Algorithm: Historical Usage (40%) + Recent Bookings (30%) + Utilization (30%)</p>
        </div>
      </div>
    </div>
  );
}