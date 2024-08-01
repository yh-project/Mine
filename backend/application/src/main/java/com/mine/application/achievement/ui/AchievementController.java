package com.mine.application.achievement.ui;

import com.mine.application.achievement.command.application.AddAchievementStatesService;
import com.mine.application.achievement.command.application.UpdateAchievementStateService;
import com.mine.application.achievement.query.AchievementStateQueryService;
import com.mine.application.achievement.ui.dto.GetAchievementStateResponse;
import com.mine.application.common.aop.LoginCheck;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/users/achievements")
@RestController
public class AchievementController {

    private final AchievementStateQueryService achievementStateQueryService;
    private final AddAchievementStatesService addAchievementStatesService;
    private final UpdateAchievementStateService updateAchievementStateService;

    @LoginCheck
    @GetMapping
    public ResponseEntity<List<GetAchievementStateResponse>> getAchievementStates() {
        return ResponseEntity.ok().body(achievementStateQueryService.getAchievementStates());
    }

    @LoginCheck
    @PostMapping
    public ResponseEntity<Void> addAchievementStates() {
        addAchievementStatesService.addAchievementStates();
        return ResponseEntity.ok().build();
    }

    @LoginCheck
    @PatchMapping("/{achievementId}")
    public ResponseEntity<Boolean> updateAchievementState(@PathVariable Integer achievementId) {
        return ResponseEntity.ok().body(updateAchievementStateService.updateAchievementState(achievementId));
    }

}
