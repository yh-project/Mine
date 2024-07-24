package com.mine.application.achievement.command.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Entity
public class AchievementState {

    @Id
    @Column(name = "achievement_state_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @Column(name = "achievement_count", nullable = false)
    private Integer count;

    @Column(name = "achievement_date")
    private LocalDateTime date;

    @Column(name = "is_achieved")
    private Boolean isAchieved;

    @Builder
    public AchievementState(String username, Achievement achievement, Integer count, LocalDateTime date) {
        this.username = username;
        this.achievement = achievement;
        this.count = count;
        this.date = date;
        this.isAchieved = false;
    }

    public void changeCount(final int count) {
        this.count = count;
        if(achievementCompleted()) {
            this.isAchieved = true;
            date = LocalDateTime.now();
        }
    }

    public boolean isAchieved() {
        return isAchieved;
    }

    private boolean achievementCompleted() {
        return achievement.getAmount().equals(count);
    }

}
