'use client';

import { useMemo, useState } from 'react';
import { H3, Text } from '../atoms/Typography';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Avatar from '../atoms/Avatar';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import Rating from '../molecules/Rating';
import reviewsData from '../../data/reviews.json';

export default function ReviewSection({ productId, rating = 0, reviewCount = 0 }) {
  const [reviews, setReviews] = useState(() => reviewsData[String(productId)] || []);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // counts[0] => 1 star ... counts[4] => 5 star
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
      counts[idx] += 1;
    });
    const total = reviews.length || 1;
    return counts
      .map((count, idx) => ({ stars: idx + 1, count, pct: Math.round((count / total) * 100) }))
      .reverse();
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !score || !comment.trim()) {
      setError('Please add your name, a rating, and a comment.');
      return;
    }
    setReviews((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        rating: score,
        comment: comment.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setName('');
    setScore(0);
    setComment('');
    setError('');
    setShowForm(false);
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <H3 className="text-2xl font-bold text-white">Customer Reviews</H3>
        <Button variant="outline" size="md" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="text-5xl font-bold text-white">{Number(rating).toFixed(1)}</div>
          <Rating value={Math.round(rating)} className="my-2" />
          <Text className="text-gray-400">Based on {reviewCount} reviews</Text>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 justify-center">
          {breakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-sm text-gray-400">
              <span className="w-12 shrink-0">{row.stars} star</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${row.pct}%` }} />
              </div>
              <span className="w-8 text-right shrink-0">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <Card className="bg-white/5 border border-white/10 mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="review-name"
              label="Your Name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Your Rating</label>
              <Rating value={score} onChange={setScore} />
            </div>
            <TextArea
              id="review-comment"
              label="Your Review"
              placeholder="Tell others what you think about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {error && <Text className="text-red-400 text-sm">{error}</Text>}
            <Button type="submit" variant="primary" className="self-start">
              Submit Review
            </Button>
          </form>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Text className="text-gray-400">No reviews yet. Be the first to share your thoughts!</Text>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4 border-b border-white/10 pb-6 last:border-0">
              <Avatar name={r.name} />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-white">{r.name}</span>
                  <span className="text-xs text-gray-500">{r.date}</span>
                </div>
                <Rating value={r.rating} className="my-1" size="w-4 h-4" />
                <Text className="text-gray-300">{r.comment}</Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
