import unittest
from backend.app.analytics import calculate_engagement_rate
from backend.app.database import SessionLocal
from backend.app.service import (
    AnalyticsService,
    get_brand_voice,
    RecommendationService,
    HindsightBridge
)
from backend.app.gaps import get_content_gaps
from backend.app.trends import get_topic_trends


class TestDeterministicAnalytics(unittest.TestCase):

    def setUp(self):
        self.db = SessionLocal()
        self.analytics = AnalyticsService(self.db)
        self.rec_service = RecommendationService(self.db)
        self.bridge = HindsightBridge(self.db)

    def tearDown(self):
        self.db.close()

    def test_calculate_engagement_rate(self):
        # Normal calculation: (100 + 20 + 30) / 1000 = 150 / 1000 = 0.15
        self.assertEqual(calculate_engagement_rate(100, 20, 30, 1000), 0.15)
        # Views is NULL -> None (never fabricated to 0)
        self.assertIsNone(calculate_engagement_rate(100, 20, 30, None))
        # Views is zero -> None (never divide by zero)
        self.assertIsNone(calculate_engagement_rate(100, 20, 30, 0))
        # None actions should default to 0
        self.assertEqual(calculate_engagement_rate(None, None, None, 500), 0.0)

    def test_content_overview(self):
        overview = self.analytics.get_content_overview("novastack")
        self.assertEqual(overview["total_content"], 111)
        self.assertIsNotNone(overview["average_engagement"])
        self.assertGreater(overview["total_views"], 100000)
        self.assertEqual(overview["top_topic"], "AI Agents")
        self.assertIsNotNone(overview["top_content_type"])
        self.assertIsNotNone(overview["published_range"]["start"])

    def test_top_and_low_topics(self):
        top_topics = self.analytics.get_top_topics("novastack", limit=3)
        self.assertEqual(len(top_topics), 3)
        self.assertGreaterEqual(top_topics[0]["average_engagement"], top_topics[1]["average_engagement"])
        self.assertGreaterEqual(top_topics[1]["average_engagement"], top_topics[2]["average_engagement"])
        for t in top_topics:
            self.assertTrue(len(t["evidence_content_ids"]) > 0)

        low_topics = self.analytics.get_low_performing_topics("novastack", limit=2)
        self.assertEqual(len(low_topics), 2)
        self.assertLess(low_topics[0]["average_engagement"], top_topics[0]["average_engagement"])

    def test_content_type_performance(self):
        ctypes = self.analytics.get_content_type_performance("novastack")
        self.assertTrue(len(ctypes) > 0)
        # Technical Guide / Tutorial should perform among top formats
        top_types = [c["content_type"] for c in ctypes[:3]]
        self.assertTrue("Technical Guide" in top_types or "Tutorial" in top_types)

    def test_content_gaps_formula(self):
        gaps = self.analytics.get_content_gaps("novastack")
        self.assertTrue(len(gaps) > 0)
        top_gap = gaps[0]
        factors = top_gap["factors"]
        expected_score = round(
            (0.40 * factors["underrepresentation"] + 0.30 * factors["staleness"] + 0.30 * factors["related_topic_performance"]) * 100,
            1
        )
        self.assertAlmostEqual(top_gap["gap_score"], expected_score, places=1)
        self.assertIn("reason", top_gap)
        self.assertTrue(len(top_gap["evidence_content_ids"]) > 0)

        # Verify Cybersecurity or FinTech appears in top gaps
        top_gap_names = [g["topic"] for g in gaps[:3]]
        self.assertTrue("Cybersecurity" in top_gap_names or "FinTech" in top_gap_names)

    def test_topic_trends_window_definition(self):
        trends = self.analytics.get_topic_trends("novastack")
        self.assertTrue(len(trends) > 0)
        valid_statuses = {"growing", "stable", "declining", "insufficient_data"}
        for tr in trends:
            self.assertIn(tr["status"], valid_statuses)
            # Explicit window fields: recent_count [0-90 days], prior_count [90-180 days]
            self.assertIn("recent_count", tr)
            self.assertIn("prior_count", tr)
            self.assertIsInstance(tr["recent_count"], int)
            self.assertIsInstance(tr["prior_count"], int)

    def test_brand_voice(self):
        bv = self.analytics.get_brand_voice("novastack")
        self.assertIn("tone", bv)
        self.assertIn("preferred_words", bv)
        self.assertIn("avoid_words", bv)
        self.assertIn("technical", bv["tone"])

    def test_content_history(self):
        history = self.analytics.get_content_history("novastack")
        self.assertTrue(len(history) > 0)
        self.assertIn("period", history[0])
        self.assertIn("content_count", history[0])
        self.assertIn("views", history[0])

    def test_team1_service_boundary_all_functions(self):
        """Verify all 11 required Team 1 service functions execute cleanly without SQL/session leaks."""
        # 1. get_content_overview
        overview = self.analytics.get_content_overview("novastack")
        self.assertIsInstance(overview, dict)

        # 2. get_top_topics
        top = self.analytics.get_top_topics("novastack", limit=3)
        self.assertIsInstance(top, list)

        # 3. get_low_performing_topics
        low = self.analytics.get_low_performing_topics("novastack", limit=2)
        self.assertIsInstance(low, list)

        # 4. get_content_type_performance
        ctypes = self.analytics.get_content_type_performance("novastack")
        self.assertIsInstance(ctypes, list)

        # 5. get_content_gaps
        gaps = self.analytics.get_content_gaps("novastack")
        self.assertIsInstance(gaps, list)

        # 6. get_topic_trends
        trends = self.analytics.get_topic_trends("novastack")
        self.assertIsInstance(trends, list)

        # 7. get_brand_voice
        bv = self.analytics.get_brand_voice("novastack")
        self.assertIsInstance(bv, dict)

        # 8. get_content_history
        hist = self.analytics.get_content_history("novastack")
        self.assertIsInstance(hist, list)

        # 9. get_insight_candidates
        insights = self.analytics.get_insight_candidates("novastack")
        self.assertIsInstance(insights, list)

        # 10. save_recommendation
        rec = self.analytics.save_recommendation(
            title="Production Guide: AI Security Controls",
            rationale="Addresses acute gap in cybersecurity with high engagement affinity.",
            target_topic="Cybersecurity",
            content_type="Technical Guide",
            supporting_content_ids=[1, 2],
            supporting_memory_refs=["gap:topic:cybersecurity"]
        )
        self.assertIsInstance(rec, dict)
        self.assertIn("id", rec)

        # 11. record_outcome
        outcome = self.analytics.record_outcome(
            recommendation_id=rec["id"],
            outcome_type="published",
            metrics={"views": 4500, "engagement_rate": 0.082},
            notes="Exceeded benchmark by 40%."
        )
        self.assertIsInstance(outcome, dict)
        self.assertEqual(outcome["outcome_type"], "published")

    def test_hindsight_bridge_insight_candidate_format(self):
        candidates = self.bridge.generate_insight_candidates("novastack")
        self.assertTrue(len(candidates) >= 3)
        for c in candidates:
            # Deterministic, deduplicatable through insight_key
            self.assertIn("insight_key", c)
            self.assertIsInstance(c["insight_key"], str)
            self.assertIn("kind", c)
            self.assertIn("statement", c)
            self.assertIsInstance(c["statement"], str)
            self.assertIn("evidence_content_ids", c)
            self.assertIsInstance(c["evidence_content_ids"], list)

        # Test outcome candidate format
        rec = self.rec_service.save_recommendation(
            title="Multi-Agent Benchmark",
            rationale="Rationale",
            target_topic="AI Agents",
            content_type="Technical Guide"
        )
        outcome = self.rec_service.record_outcome(
            recommendation_id=rec["id"],
            outcome_type="published",
            metrics={"views": 5000, "engagement_rate": 0.091},
            content_id=140
        )
        outcome_candidate = self.bridge.generate_outcome_insight(outcome["id"])
        self.assertIsNotNone(outcome_candidate)
        self.assertEqual(outcome_candidate["insight_key"], f"outcome:recommendation:{rec['id']}")
        self.assertEqual(outcome_candidate["kind"], "recommendation_outcome")
        self.assertIn("evidence_content_ids", outcome_candidate)
        self.assertEqual(outcome_candidate["evidence_content_ids"], [140])


if __name__ == "__main__":
    unittest.main()
